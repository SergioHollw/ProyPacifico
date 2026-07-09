from django.db import migrations


def reset_sequences(apps, schema_editor):
    if schema_editor.connection.vendor != 'postgresql':
        return

    tables = [
        'ticket', 'prioridad', 'estado_ticket', 'categoria',
        'persona', 'colaborador', 'tecnico_ti', 'administrador',
        'historial_estado', 'notificacion', 'ticket_comentario',
        'solucion', 'articulo',
    ]

    with schema_editor.connection.cursor() as cursor:
        for table in tables:
            try:
                seq = f"pg_get_serial_sequence('{table}', 'id')"
                max_id = f"COALESCE((SELECT MAX(id) FROM {table}), 1)"
                cursor.execute(f"SELECT setval({seq}, {max_id})")
            except Exception:
                pass


class Migration(migrations.Migration):
    dependencies = [
        ('tickets', '0002_seed_initial_data'),
    ]

    operations = [
        migrations.RunPython(reset_sequences, migrations.RunPython.noop),
    ]
