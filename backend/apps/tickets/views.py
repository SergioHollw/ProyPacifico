import os
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated

from .models import Ticket, Prioridad, Categoria, EstadoTicket
from .serializers import (
    TicketListSerializer, TicketCreateSerializer, TicketAsignarSerializer,
    TicketCambioEstadoSerializer, PrioridadSerializer, CategoriaSerializer,
    EstadoTicketSerializer,
)
from .state import EstadoFactory
from .strategy import PrioridadPorUrgencia
from .observer import NotificacionSistema, NotificacionEmail, calcular_sla_limite
from .categorizacion import categorizar
from .estrategia_asignacion import AsignacionPorEspecialidad
from .procesamiento import ProcesoTicket
from apps.usuarios.models import Colaborador, TecnicoTI
from apps.usuarios.permissions import EsAdminOTecnico
from apps.historial.models import HistorialEstado
from .models import TicketAdjunto
from .serializers import TicketListSerializer, TicketAdjuntoUploadSerializer, TicketAdjuntoSerializer


class ProcesoTicketCrear(ProcesoTicket):
    def __init__(self):
        super().__init__()
        self.attach(NotificacionSistema())

    def validar_permisos(self, ticket, request):
        if request.user.rol != 'COLABORADOR':
            return Response({'error': 'Solo los colaboradores pueden crear tickets'},
                            status=status.HTTP_403_FORBIDDEN)

    def preparar_datos(self, ticket, request, **kwargs):
        return kwargs.get('data', {})

    def ejecutar(self, ticket, datos, request):
        try:
            colaborador = request.user.perfil_colaborador
        except Colaborador.DoesNotExist:
            return Response({'error': 'Perfil de colaborador no encontrado'},
                            status=status.HTTP_400_BAD_REQUEST)

        categoria_nombre = datos.get('categoria_nombre')
        if not categoria_nombre:
            categoria_nombre = categorizar(datos['titulo'], datos.get('descripcion', ''))

        categoria = Categoria.objects.filter(
            nombre__iexact=categoria_nombre
        ).first()
        if not categoria:
            return Response({'error': f'Categoría "{categoria_nombre}" no válida'},
                            status=status.HTTP_400_BAD_REQUEST)

        estrategia = PrioridadPorUrgencia()
        prioridad = estrategia.calcular(datos['urgencia'])

        estado_abierto = EstadoTicket.objects.get(codigo='ABIERTO')

        ticket_nuevo = Ticket.objects.create(
            titulo=datos['titulo'],
            descripcion=datos.get('descripcion', ''),
            prioridad=prioridad,
            categoria=categoria,
            usuario=colaborador,
            estado=estado_abierto,
        )

        estrategia_asignacion = AsignacionPorEspecialidad()
        tecnicos = TecnicoTI.objects.filter(
            especialidad__iexact=categoria.nombre,
            disponibilidad=True,
        )
        tecnico = estrategia_asignacion.asignar(ticket_nuevo, tecnicos)
        tecnico_asignado = None
        if tecnico:
            ticket_nuevo.tecnico = tecnico
            estado_en_proceso = EstadoTicket.objects.get(codigo='EN_PROCESO')
            ticket_nuevo.estado = estado_en_proceso
            ticket_nuevo.save()
            tecnico_asignado = tecnico

        return {'ticket': ticket_nuevo, 'tecnico': tecnico_asignado}

    def notificar(self, ticket, resultado, request):
        t = resultado['ticket']
        self._gestor.notificar_todos(
            t,
            f'Ticket #{t.id} creado: {t.titulo}',
            request.user,
        )
        tecnico = resultado.get('tecnico')
        if tecnico:
            self._gestor.notificar_todos(
                t,
                f'Has sido asignado al ticket #{t.id}: {t.titulo}',
                tecnico.persona,
            )

    def registrar_historial(self, ticket, resultado, request):
        t = resultado.get('ticket')
        if t and resultado.get('tecnico'):
            estado_abierto = EstadoTicket.objects.get(codigo='ABIERTO')
            estado_en_proceso = EstadoTicket.objects.get(codigo='EN_PROCESO')
            HistorialEstado.objects.create(
                ticket=t,
                estado_anterior=estado_abierto,
                estado_nuevo=estado_en_proceso,
                usuario_cambio=request.user,
            )

    def respuesta_final(self, ticket, resultado):
        return Response(TicketListSerializer(resultado['ticket']).data, status=status.HTTP_201_CREATED)


class ProcesoTicketAsignar(ProcesoTicket):
    def __init__(self):
        super().__init__()
        self.attach(NotificacionSistema())
        self.attach(NotificacionEmail())

    def validar_permisos(self, ticket, request):
        if request.user.rol not in ('TECNICO', 'ADMINISTRADOR'):
            return Response({'error': 'Solo técnicos y administradores pueden asignar tickets'},
                            status=status.HTTP_403_FORBIDDEN)

    def preparar_datos(self, ticket, request, **kwargs):
        return kwargs.get('data', {})

    def ejecutar(self, ticket, datos, request):
        id_tecnico = datos.get('id_tecnico')

        if id_tecnico:
            try:
                tecnico = TecnicoTI.objects.get(pk=id_tecnico)
            except TecnicoTI.DoesNotExist:
                return Response({'error': 'Técnico no encontrado'},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            tecnicos = TecnicoTI.objects.filter(
                especialidad__iexact=ticket.categoria.nombre,
                disponibilidad=True,
            )
            estrategia = AsignacionPorEspecialidad()
            tecnico = estrategia.asignar(ticket, tecnicos)
            if not tecnico:
                return Response({'error': 'No hay técnicos disponibles para esta categoría'},
                                status=status.HTTP_404_NOT_FOUND)

        ticket.tecnico = tecnico
        ticket.save()

        estado_en_proceso = EstadoTicket.objects.get(codigo='EN_PROCESO')
        estado_anterior = None
        if ticket.estado.codigo == 'ABIERTO':
            estado_anterior = ticket.estado
            ticket.estado = estado_en_proceso
            ticket.save()

        return {
            'tecnico': tecnico,
            'estado_anterior': estado_anterior,
            'estado_nuevo': estado_en_proceso,
        }

    def notificar(self, ticket, resultado, request):
        self._gestor.notificar_todos(
            ticket,
            f'Ticket #{ticket.id} asignado a {resultado["tecnico"].persona.nombre}',
            ticket.usuario.persona,
        )
        self._gestor.notificar_todos(
            ticket,
            f'Has sido asignado al ticket #{ticket.id}: {ticket.titulo}',
            resultado['tecnico'].persona,
        )

    def registrar_historial(self, ticket, resultado, request):
        if resultado.get('estado_anterior'):
            HistorialEstado.objects.create(
                ticket=ticket,
                estado_anterior=resultado['estado_anterior'],
                estado_nuevo=resultado['estado_nuevo'],
                usuario_cambio=request.user,
            )


class ProcesoTicketCambiarEstado(ProcesoTicket):
    def __init__(self):
        super().__init__()
        self.attach(NotificacionSistema())

    def validar_permisos(self, ticket, request):
        pass

    def preparar_datos(self, ticket, request, **kwargs):
        return kwargs.get('data', {})

    def ejecutar(self, ticket, datos, request):
        nuevo_codigo = datos['nuevo_estado']

        if request.user.rol == 'COLABORADOR' and nuevo_codigo != 'ABIERTO':
            return Response(
                {'error': 'Los colaboradores solo pueden cambiar a estado Abierto'},
                status=status.HTTP_403_FORBIDDEN
            )

        state_actual = EstadoFactory.obtener_estado(ticket.estado.codigo)
        metodo = {
            'ABIERTO': state_actual.abrir,
            'EN_PROCESO': state_actual.procesar,
            'PENDIENTE': state_actual.pausar,
            'CERRADO': state_actual.cerrar,
        }.get(nuevo_codigo)

        if not metodo:
            return Response({'error': 'Transición de estado no válida'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            nuevo_estado_obj = metodo(ticket)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        estado_anterior = ticket.estado
        ticket.estado = nuevo_estado_obj
        if nuevo_codigo == 'CERRADO':
            ticket.fecha_cierre = timezone.now()
        ticket.save()

        return {
            'estado_anterior': estado_anterior,
            'estado_nuevo': nuevo_estado_obj,
        }

    def notificar(self, ticket, resultado, request):
        self._gestor.notificar_todos(
            ticket,
            f'Ticket #{ticket.id} cambió a {resultado["estado_nuevo"].nombre}',
            ticket.usuario.persona,
        )

    def registrar_historial(self, ticket, resultado, request):
        HistorialEstado.objects.create(
            ticket=ticket,
            estado_anterior=resultado['estado_anterior'],
            estado_nuevo=resultado['estado_nuevo'],
            usuario_cambio=request.user,
        )


class TicketViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Ticket.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        return TicketListSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.select_related(
            'prioridad', 'categoria', 'estado',
            'usuario__persona', 'tecnico__persona'
        )
        if user.rol == 'COLABORADOR':
            try:
                colab = user.perfil_colaborador
                qs = qs.filter(usuario=colab)
            except Colaborador.DoesNotExist:
                qs = qs.none()
        elif user.rol == 'TECNICO':
            try:
                tec = user.perfil_tecnico
                qs = qs.filter(tecnico=tec)
            except TecnicoTI.DoesNotExist:
                qs = qs.none()
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        estado = request.query_params.get('estado')
        categoria = request.query_params.get('categoria')
        if estado:
            queryset = queryset.filter(estado__codigo=estado.upper())
        if categoria:
            queryset = queryset.filter(categoria__nombre__iexact=categoria)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = TicketListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TicketListSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = TicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        proceso = ProcesoTicketCrear()
        return proceso.procesar(None, request, data=serializer.validated_data)

    @action(detail=True, methods=['patch'])
    def estado(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketCambioEstadoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        proceso = ProcesoTicketCambiarEstado()
        return proceso.procesar(ticket, request, data=serializer.validated_data)

    @action(detail=True, methods=['patch'])
    def asignar(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketAsignarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        proceso = ProcesoTicketAsignar()
        return proceso.procesar(ticket, request, data=serializer.validated_data)

    @action(detail=True, methods=['get'])
    def historial(self, request, pk=None):
        ticket = self.get_object()
        historiales = ticket.historial_estados.select_related(
            'estado_anterior', 'estado_nuevo', 'usuario_cambio'
        ).all()
        data = []
        for h in historiales:
            data.append({
                'id': h.id,
                'estado_anterior': h.estado_anterior.nombre if h.estado_anterior else None,
                'estado_nuevo': h.estado_nuevo.nombre,
                'fecha_cambio': h.fecha_cambio,
                'usuario': h.usuario_cambio.nombre,
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def sla_vencidos(self, request):
        tickets_abiertos = self.get_queryset().filter(
            estado__codigo__in=['ABIERTO', 'EN_PROCESO', 'PENDIENTE']
        ).select_related('prioridad', 'categoria', 'estado', 'usuario__persona', 'tecnico__persona')
        vencidos = []
        for t in tickets_abiertos:
            sla_limite = calcular_sla_limite(t)
            if timezone.now() > sla_limite:
                serializer = TicketListSerializer(t)
                data = serializer.data
                data['sla_limite'] = sla_limite
                data['sla_vencido'] = True
                vencidos.append(data)
        return Response(vencidos)


class PrioridadListView(ListModelMixin, GenericViewSet):
    queryset = Prioridad.objects.all()
    serializer_class = PrioridadSerializer
    permission_classes = [IsAuthenticated]


class CategoriaListView(ListModelMixin, GenericViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]


class TicketAdjuntoUploadView(GenericViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = TicketAdjuntoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        archivo = serializer.validated_data['archivo']
        id_ticket = serializer.validated_data['id_ticket']

        try:
            ticket = Ticket.objects.get(pk=id_ticket)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        upload_dir = settings.MEDIA_ROOT / 'adjuntos' / str(id_ticket)
        os.makedirs(upload_dir, exist_ok=True)

        nombre_archivo = f'{int(timezone.now().timestamp())}_{archivo.name}'
        ruta_archivo = str(upload_dir / nombre_archivo)

        with open(ruta_archivo, 'wb+') as f:
            for chunk in archivo.chunks():
                f.write(chunk)

        adjunto = TicketAdjunto.objects.create(
            ticket=ticket,
            nombre_archivo=archivo.name,
            ruta_archivo=f'adjuntos/{id_ticket}/{nombre_archivo}',
            tipo_archivo=archivo.content_type,
            tamanio=archivo.size,
        )

        return Response(TicketAdjuntoSerializer(adjunto).data, status=status.HTTP_201_CREATED)


class TecnicoDisponibleView(ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated, EsAdminOTecnico]

    def list(self, request):
        especialidad = request.query_params.get('especialidad')
        tecnicos = TecnicoTI.objects.filter(disponibilidad=True).select_related('persona')
        if especialidad:
            tecnicos = tecnicos.filter(especialidad__iexact=especialidad)
        data = []
        for t in tecnicos:
            data.append({
                'id': t.persona_id,
                'nombre': t.persona.nombre,
                'correo': t.persona.correo,
                'especialidad': t.especialidad,
                'disponibilidad': t.disponibilidad,
            })
        return Response(data)
