from django.contrib import admin
from .models import Solucion


@admin.register(Solucion)
class SolucionAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'tecnico', 'fecha_registro']
    search_fields = ['descripcion']
