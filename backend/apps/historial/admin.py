from django.contrib import admin
from .models import HistorialEstado


@admin.register(HistorialEstado)
class HistorialEstadoAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'estado_anterior', 'estado_nuevo', 'fecha_cambio', 'usuario_cambio']
    list_filter = ['estado_nuevo']
