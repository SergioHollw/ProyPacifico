from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated

from .models import Persona, Colaborador, TecnicoTI, Administrador
from .serializers import (
    PersonaSerializer, AdminRegistroSerializer,
    CambioPasswordSerializer,
)
from .permissions import EsAdministrador


class RegistroView(CreateModelMixin, GenericViewSet):
    queryset = Persona.objects.all()
    serializer_class = AdminRegistroSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        persona = serializer.save()
        return Response({
            'id': persona.id,
            'nombre': persona.nombre,
            'correo': persona.correo,
            'rol': persona.rol,
            'mensaje': f'Usuario {persona.rol} creado exitosamente',
        }, status=status.HTTP_201_CREATED)


class UsuarioActualView(GenericViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        persona = request.user
        data = {
            'id': persona.id,
            'nombre': persona.nombre,
            'correo': persona.correo,
            'rol': persona.rol,
            'activo': persona.activo,
            'fecha_creacion': persona.fecha_creacion,
        }
        if persona.rol == 'COLABORADOR':
            try:
                colab = persona.perfil_colaborador
                data['area'] = colab.area
                data['estado_cuenta'] = colab.estado_cuenta
            except Colaborador.DoesNotExist:
                pass
        elif persona.rol == 'TECNICO':
            try:
                tec = persona.perfil_tecnico
                data['especialidad'] = tec.especialidad
                data['disponibilidad'] = tec.disponibilidad
            except TecnicoTI.DoesNotExist:
                pass
        elif persona.rol == 'ADMINISTRADOR':
            try:
                admin = persona.perfil_admin
                data['nivel_acceso'] = admin.nivel_acceso
            except Administrador.DoesNotExist:
                pass
        return Response(data)

    @action(detail=False, methods=['patch'])
    def cambiar_password(self, request):
        serializer = CambioPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        persona = request.user
        if not persona.check_password(serializer.validated_data['password_actual']):
            return Response({'error': 'Contraseña actual incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        persona.set_password(serializer.validated_data['password_nueva'])
        persona.save()
        return Response({'mensaje': 'Contraseña actualizada exitosamente'})

    @action(detail=False, methods=['patch'], url_path='actualizar-perfil')
    def actualizar_perfil(self, request):
        persona = request.user
        nombre = request.data.get('nombre')
        if nombre:
            persona.nombre = nombre
        if persona.rol == 'COLABORADOR':
            area = request.data.get('area')
            if area is not None:
                try:
                    colab = persona.perfil_colaborador
                    colab.area = area
                    colab.save()
                except Colaborador.DoesNotExist:
                    pass
        persona.save()
        return Response({'mensaje': 'Perfil actualizado exitosamente'})


class UsuarioAdminView(CreateModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminRegistroSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        persona = serializer.save()
        return Response({
            'id': persona.id,
            'nombre': persona.nombre,
            'correo': persona.correo,
            'rol': persona.rol,
            'mensaje': f'Usuario {persona.rol} creado exitosamente',
        }, status=status.HTTP_201_CREATED)

    def list(self, request):
        personas = Persona.objects.all().order_by('-fecha_creacion')
        results = []
        for p in personas:
            item = {
                'id': p.id,
                'nombre': p.nombre,
                'correo': p.correo,
                'rol': p.rol,
                'activo': p.activo,
                'fecha_creacion': p.fecha_creacion,
            }
            if p.rol == 'COLABORADOR':
                try:
                    item['area'] = p.perfil_colaborador.area
                except Colaborador.DoesNotExist:
                    item['area'] = ''
            elif p.rol == 'TECNICO':
                try:
                    tec = p.perfil_tecnico
                    item['especialidad'] = tec.especialidad
                    item['disponibilidad'] = tec.disponibilidad
                except TecnicoTI.DoesNotExist:
                    item['especialidad'] = ''
                    item['disponibilidad'] = True
            elif p.rol == 'ADMINISTRADOR':
                try:
                    item['nivel_acceso'] = p.perfil_admin.nivel_acceso
                except Administrador.DoesNotExist:
                    item['nivel_acceso'] = ''
            results.append(item)
        return Response(results)

    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        persona = self.get_object()
        persona.activo = not persona.activo
        persona.save()
        return Response({
            'id': persona.id,
            'activo': persona.activo,
            'mensaje': 'Estado actualizado' if persona.activo else 'Usuario desactivado',
        })
