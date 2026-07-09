from rest_framework import serializers
from .models import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    ticket_titulo = serializers.CharField(source='ticket.titulo', read_only=True)

    class Meta:
        model = Notificacion
        fields = [
            'id', 'ticket', 'ticket_titulo', 'destinatario',
            'tipo', 'mensaje', 'fecha_envio', 'leido',
        ]
        read_only_fields = ['id', 'fecha_envio']
