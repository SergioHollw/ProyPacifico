from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Notificacion
from .serializers import NotificacionSerializer


class NotificacionViewSet(ReadOnlyModelViewSet):
    queryset = Notificacion.objects.select_related('ticket').all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(
            destinatario=self.request.user
        ).select_related('ticket').all().order_by('-fecha_envio')

    @action(detail=True, methods=['patch'])
    def leer(self, request, pk=None):
        notificacion = self.get_object()
        notificacion.leido = True
        notificacion.save()
        return Response(NotificacionSerializer(notificacion).data)

    @action(detail=False, methods=['get'])
    def no_leidas(self, request):
        qs = self.get_queryset().filter(leido=False)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def contar_no_leidas(self, request):
        count = self.get_queryset().filter(leido=False).count()
        return Response({'no_leidas': count})

    @action(detail=False, methods=['patch'])
    def marcar_todas_leidas(self, request):
        self.get_queryset().filter(leido=False).update(leido=True)
        return Response({'mensaje': 'Todas las notificaciones marcadas como leídas'})
