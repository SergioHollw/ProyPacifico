from rest_framework import serializers
from .models import Solucion


class SolucionSerializer(serializers.ModelSerializer):
    ticket_titulo = serializers.CharField(source='ticket.titulo', read_only=True)
    tecnico_nombre = serializers.CharField(source='tecnico.persona.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='ticket.categoria.nombre', read_only=True)

    class Meta:
        model = Solucion
        fields = [
            'id', 'ticket', 'ticket_titulo', 'descripcion',
            'fecha_registro', 'tecnico', 'tecnico_nombre', 'categoria_nombre',
        ]
        read_only_fields = ['id', 'fecha_registro', 'tecnico']
