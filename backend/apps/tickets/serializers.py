from rest_framework import serializers
from .models import Ticket, Prioridad, Categoria, EstadoTicket, TicketAdjunto


class PrioridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prioridad
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EstadoTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoTicket
        fields = '__all__'


class TicketListSerializer(serializers.ModelSerializer):
    prioridad_nombre = serializers.CharField(source='prioridad.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)
    estado_codigo = serializers.CharField(source='estado.codigo', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.persona.nombre', read_only=True)
    tecnico_nombre = serializers.CharField(source='tecnico.persona.nombre', read_only=True, default=None)

    class Meta:
        model = Ticket
        fields = [
            'id', 'titulo', 'descripcion', 'prioridad', 'prioridad_nombre',
            'categoria', 'categoria_nombre', 'estado', 'estado_nombre', 'estado_codigo',
            'usuario', 'usuario_nombre', 'tecnico', 'tecnico_nombre',
            'fecha_registro', 'fecha_actualizacion', 'fecha_cierre',
        ]
        read_only_fields = ['id', 'fecha_registro', 'fecha_actualizacion', 'fecha_cierre']


class TicketCreateSerializer(serializers.Serializer):
    titulo = serializers.CharField(max_length=150)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    categoria_nombre = serializers.CharField(max_length=50, required=False, allow_null=True, default=None)
    urgencia = serializers.ChoiceField(choices=['baja', 'media', 'alta', 'critica'])


class TicketAsignarSerializer(serializers.Serializer):
    id_tecnico = serializers.IntegerField(required=False, allow_null=True, default=None)


class TicketCambioEstadoSerializer(serializers.Serializer):
    nuevo_estado = serializers.ChoiceField(
        choices=['ABIERTO', 'EN_PROCESO', 'PENDIENTE', 'CERRADO']
    )


class TicketAdjuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAdjunto
        fields = '__all__'
        read_only_fields = ['id', 'ruta_archivo', 'fecha_subida']


class TicketAdjuntoUploadSerializer(serializers.Serializer):
    archivo = serializers.FileField()
    id_ticket = serializers.IntegerField()
