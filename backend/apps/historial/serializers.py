from rest_framework import serializers
from .models import HistorialEstado


class HistorialEstadoSerializer(serializers.ModelSerializer):
    estado_anterior_nombre = serializers.CharField(
        source='estado_anterior.nombre', read_only=True, default=None
    )
    estado_nuevo_nombre = serializers.CharField(
        source='estado_nuevo.nombre', read_only=True
    )
    usuario_nombre = serializers.CharField(
        source='usuario_cambio.nombre', read_only=True
    )

    class Meta:
        model = HistorialEstado
        fields = [
            'id', 'ticket', 'estado_anterior', 'estado_anterior_nombre',
            'estado_nuevo', 'estado_nuevo_nombre', 'fecha_cambio',
            'usuario_cambio', 'usuario_nombre',
        ]
        read_only_fields = ['id', 'fecha_cambio']
