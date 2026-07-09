from django.db import models
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Solucion
from .serializers import SolucionSerializer

from apps.usuarios.models import TecnicoTI
from apps.tickets.state import EstadoFactory
from apps.historial.models import HistorialEstado


class SolucionViewSet(ReadOnlyModelViewSet):
    queryset = Solucion.objects.select_related(
        'ticket', 'ticket__categoria', 'tecnico__persona'
    ).all()
    serializer_class = SolucionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket')
        categoria = self.request.query_params.get('categoria')
        busqueda = self.request.query_params.get('q')
        if ticket_id:
            qs = qs.filter(ticket_id=ticket_id)
        if categoria:
            qs = qs.filter(ticket__categoria__nombre__iexact=categoria)
        if busqueda:
            qs = qs.filter(
                models.Q(descripcion__icontains=busqueda) |
                models.Q(ticket__titulo__icontains=busqueda)
            )
        return qs

    def create(self, request, *args, **kwargs):
        if request.user.rol != 'TECNICO':
            return Response({'error': 'Solo técnicos pueden registrar soluciones'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = SolucionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            tecnico = request.user.perfil_tecnico
        except TecnicoTI.DoesNotExist:
            return Response({'error': 'Perfil de técnico no encontrado'},
                            status=status.HTTP_400_BAD_REQUEST)

        ticket = serializer.validated_data['ticket']

        if Solucion.objects.filter(ticket=ticket).exists():
            return Response({'error': 'El ticket ya tiene una solución registrada'},
                            status=status.HTTP_400_BAD_REQUEST)

        solucion = serializer.save(tecnico=tecnico)

        if ticket.estado.codigo != 'CERRADO':
            state_actual = EstadoFactory.obtener_estado(ticket.estado.codigo)
            nuevo_estado = state_actual.cerrar(ticket)
            estado_anterior = ticket.estado
            ticket.estado = nuevo_estado
            ticket.fecha_cierre = timezone.now()
            ticket.save()

            HistorialEstado.objects.create(
                ticket=ticket,
                estado_anterior=estado_anterior,
                estado_nuevo=nuevo_estado,
                usuario_cambio=request.user,
            )

        return Response(SolucionSerializer(solucion).data, status=status.HTTP_201_CREATED)
