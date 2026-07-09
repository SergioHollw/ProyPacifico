from django.contrib import admin
from .models import Colaborador, TecnicoTI, Administrador


@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ['persona_id', 'persona', 'area', 'estado_cuenta']


@admin.register(TecnicoTI)
class TecnicoTIAdmin(admin.ModelAdmin):
    list_display = ['persona_id', 'persona', 'especialidad', 'disponibilidad']


@admin.register(Administrador)
class AdministradorAdmin(admin.ModelAdmin):
    list_display = ['persona_id', 'persona', 'nivel_acceso']
