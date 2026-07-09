from django.contrib import admin
from .models import Articulo

@admin.register(Articulo)
class ArticuloAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'categoria', 'fecha_publicacion', 'autor']
    list_filter = ['categoria']
    search_fields = ['titulo', 'descripcion', 'contenido']
