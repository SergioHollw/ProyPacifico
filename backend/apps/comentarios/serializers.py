from rest_framework import serializers
from .models import TicketComentario


class ComentarioSerializer(serializers.ModelSerializer):
    persona_nombre = serializers.CharField(source='persona.nombre', read_only=True)
    persona_rol = serializers.CharField(source='persona.rol', read_only=True)

    class Meta:
        model = TicketComentario
        fields = [
            'id', 'ticket', 'persona', 'persona_nombre', 'persona_rol',
            'mensaje', 'fecha_registro',
        ]
        read_only_fields = ['id', 'persona', 'fecha_registro']
