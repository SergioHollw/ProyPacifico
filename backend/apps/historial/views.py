from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import HistorialEstado
from .serializers import HistorialEstadoSerializer


class HistorialViewSet(ReadOnlyModelViewSet):
    queryset = HistorialEstado.objects.select_related(
        'estado_anterior', 'estado_nuevo', 'usuario_cambio'
    ).all()
    serializer_class = HistorialEstadoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket')
        if ticket_id:
            qs = qs.filter(ticket_id=ticket_id)
        return qs
