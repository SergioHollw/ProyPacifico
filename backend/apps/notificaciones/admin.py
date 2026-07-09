from django.contrib import admin
from .models import Notificacion


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'destinatario', 'tipo', 'leido', 'fecha_envio']
    list_filter = ['leido', 'tipo']
