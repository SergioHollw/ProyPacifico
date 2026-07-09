"""
Script de datos iniciales para PacificoDB.
Inserta catalogos y usuarios demo.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pacificodb.settings')
import django
django.setup()

from django.db import transaction
from apps.usuarios.models import Persona, Colaborador, TecnicoTI, Administrador
from apps.tickets.models import Prioridad, Categoria, EstadoTicket


@transaction.atomic
def seed():
    print('Limpiando datos existentes...')
    Persona.objects.all().delete()
    EstadoTicket.objects.all().delete()
    Prioridad.objects.all().delete()
    Categoria.objects.all().delete()
    print('  OK')

    print('Insertando catalogos...')

    estados = [
        {'id': 1, 'nombre': 'Abierto', 'codigo': 'ABIERTO'},
        {'id': 2, 'nombre': 'En proceso', 'codigo': 'EN_PROCESO'},
        {'id': 3, 'nombre': 'Pendiente', 'codigo': 'PENDIENTE'},
        {'id': 4, 'nombre': 'Cerrado', 'codigo': 'CERRADO'},
    ]
    for e in estados:
        EstadoTicket.objects.create(**e)
    print(f'  ==> {len(estados)} estados de ticket')

    prioridades = [
        {'id': 1, 'nombre': 'Crítica', 'nivel': 1},
        {'id': 2, 'nombre': 'Alta', 'nivel': 2},
        {'id': 3, 'nombre': 'Media', 'nivel': 3},
        {'id': 4, 'nombre': 'Baja', 'nivel': 4},
    ]
    for p in prioridades:
        Prioridad.objects.create(**p)
    print(f'  ==> {len(prioridades)} prioridades')

    categorias = [
        {'id': 1, 'nombre': 'Hardware', 'descripcion': 'Problemas de equipos fisicos'},
        {'id': 2, 'nombre': 'Software', 'descripcion': 'Problemas de aplicaciones'},
        {'id': 3, 'nombre': 'Redes', 'descripcion': 'Problemas de conectividad'},
    ]
    for c in categorias:
        Categoria.objects.create(**c)
    print(f'  ==> {len(categorias)} categorias')

    print('Insertando usuarios demo...')

    admin = Persona.objects.create_user(
        correo='admin@pacifico.com.pe',
        nombre='Admin Pacifico',
        password='Admin123!',
        rol='ADMINISTRADOR',
    )
    Administrador.objects.create(persona=admin, nivel_acceso='TOTAL')

    colab1 = Persona.objects.create_user(
        correo='colaborador1@pacifico.com.pe',
        nombre='Carlos Lopez',
        password='Colab123!',
        rol='COLABORADOR',
    )
    Colaborador.objects.create(persona=colab1, area='Contabilidad', estado_cuenta='ACTIVO')

    colab2 = Persona.objects.create_user(
        correo='colaborador2@pacifico.com.pe',
        nombre='Maria Garcia',
        password='Colab123!',
        rol='COLABORADOR',
    )
    Colaborador.objects.create(persona=colab2, area='Recursos Humanos', estado_cuenta='ACTIVO')

    tec1 = Persona.objects.create_user(
        correo='tecnico1@pacifico.com.pe',
        nombre='Pedro Ramirez',
        password='Tec123!',
        rol='TECNICO',
    )
    TecnicoTI.objects.create(persona=tec1, especialidad='Hardware', disponibilidad=True)

    tec2 = Persona.objects.create_user(
        correo='tecnico2@pacifico.com.pe',
        nombre='Lucia Torres',
        password='Tec123!',
        rol='TECNICO',
    )
    TecnicoTI.objects.create(persona=tec2, especialidad='Software', disponibilidad=True)

    tec3 = Persona.objects.create_user(
        correo='tecnico3@pacifico.com.pe',
        nombre='Jorge Mendoza',
        password='Tec123!',
        rol='TECNICO',
    )
    TecnicoTI.objects.create(persona=tec3, especialidad='Redes', disponibilidad=True)

    print('  ==> 6 usuarios creados')

    print('\nSeed completado exitosamente.')
    print('\nUsuarios demo:')
    print('  Admin:      admin@pacifico.com.pe / Admin123!')
    print('  Colaborador: colaborador1@pacifico.com.pe / Colab123!')
    print('  Colaborador: colaborador2@pacifico.com.pe / Colab123!')
    print('  Tecnico:     tecnico1@pacifico.com.pe / Tec123!')
    print('  Tecnico:     tecnico2@pacifico.com.pe / Tec123!')
    print('  Tecnico:     tecnico3@pacifico.com.pe / Tec123!')


if __name__ == '__main__':
    seed()
