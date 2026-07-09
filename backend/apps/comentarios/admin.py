from django.contrib import admin
from .models import TicketComentario


@admin.register(TicketComentario)
class TicketComentarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'persona', 'fecha_registro', 'mensaje']
    list_filter = ['ticket']
