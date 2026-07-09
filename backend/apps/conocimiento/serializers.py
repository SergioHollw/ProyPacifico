from rest_framework import serializers
from .models import Articulo

class ArticuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articulo
        fields = ['id', 'titulo', 'categoria', 'descripcion', 'contenido', 'icono', 'autor', 'fecha_publicacion']
        read_only_fields = ['id', 'fecha_publicacion']

class ArticuloListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articulo
        fields = ['id', 'titulo', 'categoria', 'descripcion', 'icono', 'autor', 'fecha_publicacion']
