from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import TicketComentario
from .serializers import ComentarioSerializer


class ComentarioViewSet(ReadOnlyModelViewSet):
    queryset = TicketComentario.objects.select_related('persona', 'ticket').all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket')
        if ticket_id:
            qs = qs.filter(ticket_id=ticket_id)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = ComentarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(persona=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
