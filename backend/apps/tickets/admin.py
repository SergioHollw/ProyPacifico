from django.contrib import admin
from .models import Ticket, Prioridad, Categoria, EstadoTicket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'prioridad', 'categoria', 'estado', 'usuario', 'tecnico', 'fecha_registro']
    list_filter = ['estado', 'prioridad', 'categoria']
    search_fields = ['titulo', 'descripcion']


@admin.register(Prioridad)
class PrioridadAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'nivel']


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'descripcion']


@admin.register(EstadoTicket)
class EstadoTicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'codigo']
