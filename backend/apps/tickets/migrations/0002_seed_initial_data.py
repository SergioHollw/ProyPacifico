from datetime import datetime
from django.db import migrations
from django.contrib.auth.hashers import make_password


def seed_data(apps, schema_editor):
    # ── Modelos históricos ──
    Persona = apps.get_model('usuarios', 'Persona')
    Colaborador = apps.get_model('usuarios', 'Colaborador')
    TecnicoTI = apps.get_model('usuarios', 'TecnicoTI')
    Administrador = apps.get_model('usuarios', 'Administrador')
    EstadoTicket = apps.get_model('tickets', 'EstadoTicket')
    Prioridad = apps.get_model('tickets', 'Prioridad')
    Categoria = apps.get_model('tickets', 'Categoria')
    Ticket = apps.get_model('tickets', 'Ticket')
    HistorialEstado = apps.get_model('historial', 'HistorialEstado')
    Solucion = apps.get_model('soluciones', 'Solucion')
    TicketComentario = apps.get_model('comentarios', 'TicketComentario')
    Notificacion = apps.get_model('notificaciones', 'Notificacion')
    Articulo = apps.get_model('conocimiento', 'Articulo')

    # ════════════════════════════════════════════
    # 1. CATÁLOGOS (Estados, Prioridades, Categorías)
    # ════════════════════════════════════════════
    estados = [
        EstadoTicket(id=1, nombre='Abierto', codigo='ABIERTO'),
        EstadoTicket(id=2, nombre='En proceso', codigo='EN_PROCESO'),
        EstadoTicket(id=3, nombre='Pendiente', codigo='PENDIENTE'),
        EstadoTicket(id=4, nombre='Cerrado', codigo='CERRADO'),
    ]
    EstadoTicket.objects.bulk_create(estados)

    prioridades = [
        Prioridad(id=1, nombre='Crítica', nivel=1),
        Prioridad(id=2, nombre='Alta', nivel=2),
        Prioridad(id=3, nombre='Media', nivel=3),
        Prioridad(id=4, nombre='Baja', nivel=4),
    ]
    Prioridad.objects.bulk_create(prioridades)

    categorias = [
        Categoria(id=1, nombre='Hardware', descripcion='Problemas de equipos fisicos'),
        Categoria(id=2, nombre='Software', descripcion='Problemas de aplicaciones'),
        Categoria(id=3, nombre='Redes', descripcion='Problemas de conectividad'),
    ]
    Categoria.objects.bulk_create(categorias)

    # ════════════════════════════════════════════
    # 2. USUARIOS DEMO
    # ════════════════════════════════════════════
    pwd_admin = make_password('Admin123')
    pwd_colab = make_password('Col123')
    pwd_tec = make_password('Tec123')

    personas = [
        Persona(id=1, nombre='Sergio Hancco', correo='sergio@gmail.com',
                contrasena=pwd_admin, rol='ADMINISTRADOR', activo=True),
        Persona(id=2, nombre='Dante Elescano', correo='dante@gmail.com',
                contrasena=pwd_colab, rol='COLABORADOR', activo=True),
        Persona(id=3, nombre='Adrián Egusquiza', correo='adrian@gmail.com',
                contrasena=pwd_colab, rol='COLABORADOR', activo=True),
        Persona(id=4, nombre='Jheymi Andia', correo='jheymi@gmail.com',
                contrasena=pwd_tec, rol='TECNICO', activo=True),
        Persona(id=5, nombre='Diego Ramírez', correo='diego@gmail.com',
                contrasena=pwd_tec, rol='TECNICO', activo=True),
        Persona(id=6, nombre='Jorge Mendoza', correo='jorge@gmail.com',
                contrasena=pwd_tec, rol='TECNICO', activo=True),
    ]
    Persona.objects.bulk_create(personas)

    # Perfiles específicos (mismos IDs que Persona por ser OneToOne PK)
    Colaborador.objects.bulk_create([
        Colaborador(persona_id=2, area='Contabilidad', estado_cuenta='ACTIVO'),
        Colaborador(persona_id=3, area='Recursos Humanos', estado_cuenta='ACTIVO'),
    ])
    TecnicoTI.objects.bulk_create([
        TecnicoTI(persona_id=4, especialidad='Hardware', disponibilidad=True),
        TecnicoTI(persona_id=5, especialidad='Software', disponibilidad=True),
        TecnicoTI(persona_id=6, especialidad='Redes', disponibilidad=True),
    ])
    Administrador.objects.create(persona_id=1, nivel_acceso='TOTAL')

    # ════════════════════════════════════════════
    # 3. TICKETS (con IDs específicos)
    # ════════════════════════════════════════════
    tickets = [
        Ticket(id=1, titulo='Instalación de software Office 365',
               descripcion='Solicito instalación de Microsoft Office 365 en mi equipo. Ya tengo la licencia asignada.',
               prioridad_id=3, categoria_id=2, usuario_id=2, tecnico_id=5, estado_id=1,
               fecha_registro=datetime(2026, 7, 1, 9, 15), fecha_actualizacion=datetime(2026, 7, 1, 9, 15)),
        Ticket(id=2, titulo='Configuración de VPN',
               descripcion='Necesito acceso VPN para trabajar desde casa. Ya tengo las credenciales corporativas.',
               prioridad_id=2, categoria_id=3, usuario_id=3, tecnico_id=6, estado_id=2,
               fecha_registro=datetime(2026, 7, 2, 10, 30), fecha_actualizacion=datetime(2026, 7, 3, 8, 0)),
        Ticket(id=3, titulo='Laptop no enciende',
               descripcion='Mi laptop dejó de encender después de una actualización de Windows. La pantalla se queda en negro.',
               prioridad_id=1, categoria_id=1, usuario_id=2, tecnico_id=4, estado_id=1,
               fecha_registro=datetime(2026, 7, 3, 14, 0), fecha_actualizacion=datetime(2026, 7, 3, 14, 0)),
        Ticket(id=4, titulo='Acceso a SAP',
               descripcion='Solicito permisos de acceso al módulo de contabilidad en SAP. Mi usuario aún no está habilitado.',
               prioridad_id=3, categoria_id=2, usuario_id=3, tecnico_id=5, estado_id=4,
               fecha_registro=datetime(2026, 6, 28, 8, 0), fecha_actualizacion=datetime(2026, 6, 30, 17, 0),
               fecha_cierre=datetime(2026, 6, 30, 17, 0)),
        Ticket(id=5, titulo='Correo Outlook no envía',
               descripcion='Puedo recibir correos pero no puedo enviar. Me sale error de permisos en Outlook.',
               prioridad_id=2, categoria_id=2, usuario_id=2, tecnico_id=5, estado_id=2,
               fecha_registro=datetime(2026, 7, 4, 11, 45), fecha_actualizacion=datetime(2026, 7, 4, 16, 0)),
        Ticket(id=6, titulo='Nuevo usuario en Active Directory',
               descripcion='Solicito la creación de un nuevo usuario corporativo para el área de Recursos Humanos.',
               prioridad_id=3, categoria_id=2, usuario_id=3, tecnico=None, estado_id=1,
               fecha_registro=datetime(2026, 7, 5, 9, 0), fecha_actualizacion=datetime(2026, 7, 5, 9, 0)),
    ]
    Ticket.objects.bulk_create(tickets)

    # ════════════════════════════════════════════
    # 4. HISTORIAL DE ESTADOS
    # ════════════════════════════════════════════
    historiales = [
        HistorialEstado(id=1, ticket_id=1, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 7, 1, 9, 15), usuario_cambio_id=2),
        HistorialEstado(id=2, ticket_id=2, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 7, 2, 10, 30), usuario_cambio_id=3),
        HistorialEstado(id=3, ticket_id=2, estado_anterior_id=1, estado_nuevo_id=2,
                        fecha_cambio=datetime(2026, 7, 3, 8, 0), usuario_cambio_id=6),
        HistorialEstado(id=4, ticket_id=3, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 7, 3, 14, 0), usuario_cambio_id=2),
        HistorialEstado(id=5, ticket_id=4, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 6, 28, 8, 0), usuario_cambio_id=3),
        HistorialEstado(id=6, ticket_id=4, estado_anterior_id=1, estado_nuevo_id=2,
                        fecha_cambio=datetime(2026, 6, 29, 9, 0), usuario_cambio_id=5),
        HistorialEstado(id=7, ticket_id=4, estado_anterior_id=2, estado_nuevo_id=4,
                        fecha_cambio=datetime(2026, 6, 30, 17, 0), usuario_cambio_id=1),
        HistorialEstado(id=8, ticket_id=5, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 7, 4, 11, 45), usuario_cambio_id=2),
        HistorialEstado(id=9, ticket_id=5, estado_anterior_id=1, estado_nuevo_id=2,
                        fecha_cambio=datetime(2026, 7, 4, 16, 0), usuario_cambio_id=5),
        HistorialEstado(id=10, ticket_id=6, estado_anterior=None, estado_nuevo_id=1,
                        fecha_cambio=datetime(2026, 7, 5, 9, 0), usuario_cambio_id=3),
    ]
    HistorialEstado.objects.bulk_create(historiales)

    # ════════════════════════════════════════════
    # 5. SOLUCIONES
    # ════════════════════════════════════════════
    Solucion.objects.create(
        id=1, ticket_id=4,
        descripcion='Se configuró el acceso al módulo de contabilidad en SAP. Se asignaron los roles correspondientes y se probó el ingreso exitosamente.',
        fecha_registro=datetime(2026, 6, 30, 16, 30), tecnico_id=5,
    )

    # ════════════════════════════════════════════
    # 6. COMENTARIOS
    # ════════════════════════════════════════════
    comentarios = [
        TicketComentario(id=1, ticket_id=2, persona_id=6,
                         mensaje='He revisado tu solicitud. Te enviaré las instrucciones de configuración por correo.',
                         fecha_registro=datetime(2026, 7, 3, 8, 5)),
        TicketComentario(id=2, ticket_id=2, persona_id=3,
                         mensaje='Gracias, estaré atento al correo.',
                         fecha_registro=datetime(2026, 7, 3, 8, 10)),
        TicketComentario(id=3, ticket_id=3, persona_id=4,
                         mensaje='He programado una revisión presencial para mañana a las 9am. Por favor trae tu laptop y cargador.',
                         fecha_registro=datetime(2026, 7, 3, 15, 0)),
        TicketComentario(id=4, ticket_id=5, persona_id=5,
                         mensaje='He identificado que tu cuenta de correo tiene permisos incorrectos. Ya lo estoy corrigiendo.',
                         fecha_registro=datetime(2026, 7, 4, 16, 5)),
        TicketComentario(id=5, ticket_id=5, persona_id=2,
                         mensaje='Gracias, quedo atento a la solución.',
                         fecha_registro=datetime(2026, 7, 4, 16, 10)),
        TicketComentario(id=6, ticket_id=4, persona_id=1,
                         mensaje='Se ha completado la configuración de SAP. Ticket cerrado.',
                         fecha_registro=datetime(2026, 6, 30, 17, 0)),
    ]
    TicketComentario.objects.bulk_create(comentarios)

    # ════════════════════════════════════════════
    # 7. NOTIFICACIONES
    # ════════════════════════════════════════════
    notificaciones = [
        Notificacion(id=1, ticket_id=1, destinatario_id=2, tipo='ASIGNACION',
                     mensaje='Su ticket "Instalación de software Office 365" ha sido asignado.',
                     fecha_envio=datetime(2026, 7, 1, 9, 20), leido=True),
        Notificacion(id=2, ticket_id=2, destinatario_id=3, tipo='ASIGNACION',
                     mensaje='Su ticket "Configuración de VPN" ha sido asignado.',
                     fecha_envio=datetime(2026, 7, 3, 8, 0), leido=False),
        Notificacion(id=3, ticket_id=2, destinatario_id=3, tipo='COMENTARIO',
                     mensaje='Nuevo comentario en su ticket "Configuración de VPN".',
                     fecha_envio=datetime(2026, 7, 3, 8, 5), leido=False),
        Notificacion(id=4, ticket_id=3, destinatario_id=2, tipo='ASIGNACION',
                     mensaje='Su ticket "Laptop no enciende" ha sido asignado.',
                     fecha_envio=datetime(2026, 7, 3, 15, 0), leido=False),
        Notificacion(id=5, ticket_id=5, destinatario_id=2, tipo='ASIGNACION',
                     mensaje='Su ticket "Correo Outlook no envía" ha sido asignado.',
                     fecha_envio=datetime(2026, 7, 4, 16, 0), leido=False),
        Notificacion(id=6, ticket_id=5, destinatario_id=2, tipo='COMENTARIO',
                     mensaje='Nuevo comentario en su ticket "Correo Outlook no envía".',
                     fecha_envio=datetime(2026, 7, 4, 16, 5), leido=False),
        Notificacion(id=7, ticket_id=4, destinatario_id=3, tipo='CIERRE',
                     mensaje='Su ticket "Acceso a SAP" ha sido cerrado.',
                     fecha_envio=datetime(2026, 6, 30, 17, 0), leido=True),
    ]
    Notificacion.objects.bulk_create(notificaciones)

    # ════════════════════════════════════════════
    # 8. ARTÍCULOS (Base de Conocimiento)
    # ════════════════════════════════════════════
    Articulo.objects.bulk_create([
        Articulo(id=1, titulo='Laptop no enciende', categoria='Hardware',
                 descripcion='Guia paso a paso para diagnosticar y solucionar problemas de encendido en laptops corporativas.',
                 contenido='Si tu laptop no enciende, sigue estos pasos:\n\n'
                           '1. Conecta el cargador y espera 5 minutos.\n'
                           '2. Manten presionado el boton de encendido por 15 segundos.\n'
                           '3. Retira la bateria (si es removible) y vuelve a insertarla.\n'
                           '4. Conecta solo el cargador e intenta encender.\n'
                           '5. Si aun no enciende, contacta a soporte tecnico.',
                 icono='\U0001F4BB', autor='Soporte Técnico', activo=True),
        Articulo(id=2, titulo='Pantalla azul de error', categoria='Hardware',
                 descripcion='Identifica las causas comunes de pantallazos azules y como resolverlos temporalmente.',
                 contenido='Los errores de pantalla azul (BSOD) pueden deberse a:\n\n'
                           '1. Controladores desactualizados.\n'
                           '2. Memoria RAM defectuosa.\n'
                           '3. Disco duro danado.\n'
                           '4. Sobrecalentamiento.\n\n'
                           'Reinicia el equipo en modo seguro y ejecuta un diagnostico de memoria.',
                 icono='\U0001F5A5\U0000FE0F', autor='Soporte Técnico', activo=True),
        Articulo(id=3, titulo='Problema de RAM', categoria='Hardware',
                 descripcion='Sintomas de fallos en la memoria RAM y herramientas para diagnosticar el problema.',
                 contenido='Sintomas de fallo de RAM:\n\n'
                           '- Congelamientos aleatorios.\n'
                           '- Aplicaciones que se cierran inesperadamente.\n'
                           '- Errores al copiar archivos grandes.\n\n'
                           'Ejecuta la herramienta \'Diagnostico de Memoria de Windows\' para verificar.',
                 icono='\U0001F9E0', autor='Soporte Técnico', activo=True),
        Articulo(id=4, titulo='Outlook no abre', categoria='Software',
                 descripcion='Soluciones para problemas comunes al abrir Microsoft Outlook en el entorno corporativo.',
                 contenido='Si Outlook no abre:\n\n'
                           '1. Cierra Outlook y abre el Panel de Control.\n'
                           '2. Ve a \'Correo\' y selecciona \'Mostrar perfiles\'.\n'
                           '3. Crea un nuevo perfil y configuralo.\n'
                           '4. Abre Outlook con el nuevo perfil.\n'
                           '5. Si persiste, repara la instalacion de Office.',
                 icono='\U0001F4E7', autor='Soporte Técnico', activo=True),
        Articulo(id=5, titulo='Microsoft Teams no conecta', categoria='Software',
                 descripcion='Pasos para resolver problemas de conexion en Microsoft Teams.',
                 contenido='Si Teams no conecta:\n\n'
                           '1. Verifica tu conexion a internet.\n'
                           '2. Cierra Teams completamente y vuelve a abrir.\n'
                           '3. Borra la cache: %appdata%\\Microsoft\\Teams.\n'
                           '4. Desactiva el proxy temporalmente.\n'
                           '5. Reinstala Teams si el problema persiste.',
                 icono='\U0001F4AC', autor='Soporte Técnico', activo=True),
        Articulo(id=6, titulo='Office no se activa', categoria='Software',
                 descripcion='Guia para solucionar problemas de activacion de Microsoft Office 365.',
                 contenido='Para activar Office:\n\n'
                           '1. Abre cualquier aplicacion de Office.\n'
                           '2. Ve a Archivo > Cuenta > Activar producto.\n'
                           '3. Ingresa tu correo corporativo.\n'
                           '4. Si no se activa, ejecuta el solucionador de problemas de Office.\n'
                           '5. Contacta a TI si el problema continua.',
                 icono='\U0001F4C4', autor='Soporte Técnico', activo=True),
        Articulo(id=7, titulo='SAP no responde', categoria='Software',
                 descripcion='Que hacer cuando SAP GUI se congela o no responde a tiempo.',
                 contenido='Si SAP no responde:\n\n'
                           '1. Presiona Ctrl+Shift+Esc para abrir el Administrador de tareas.\n'
                           '2. Finaliza el proceso de SAP.\n'
                           '3. Limpia la cache de SAP: carpeta \'SAPworkdir\'.\n'
                           '4. Verifica la conexion de red.\n'
                           '5. Vuelve a iniciar sesion en SAP.',
                 icono='\U0001F4CA', autor='Soporte Técnico', activo=True),
        Articulo(id=8, titulo='Configurar VPN corporativa', categoria='Redes',
                 descripcion='Instrucciones para instalar y configurar la VPN de acceso remoto a la red corporativa.',
                 contenido='Para configurar la VPN:\n\n'
                           '1. Descarga el cliente VPN desde el portal de TI.\n'
                           '2. Instala el software con permisos de administrador.\n'
                           '3. Ingresa la direccion del servidor: vpn.pacifico.com.pe\n'
                           '4. Usa tus credenciales corporativas.\n'
                           '5. Conectate y verifica el acceso a recursos internos.',
                 icono='\U0001F512', autor='Soporte Técnico', activo=True),
        Articulo(id=9, titulo='WiFi corporativo no funciona', categoria='Redes',
                 descripcion='Soluciones para problemas de conexion a la red WiFi de la empresa.',
                 contenido='Si el WiFi no funciona:\n\n'
                           '1. Olvida la red y vuelve a conectarte.\n'
                           '2. Reinicia el adaptador de red.\n'
                           '3. Ejecuta \'ipconfig /release\' y \'ipconfig /renew\'.\n'
                           '4. Verifica que el modo avion este desactivado.\n'
                           '5. Contacta a soporte si el problema persiste.',
                 icono='\U0001F4F6', autor='Soporte Técnico', activo=True),
        Articulo(id=10, titulo='Internet lento en la oficina', categoria='Redes',
                 descripcion='Causas comunes de lentitud en la red corporativa y como reportarlas.',
                 contenido='Si el internet esta lento:\n\n'
                           '1. Verifica si otros usuarios tienen el mismo problema.\n'
                           '2. Desconectate de la VPN si no la necesitas.\n'
                           '3. Cierra aplicaciones que consuman mucho ancho de banda.\n'
                           '4. Ejecuta un speed test.\n'
                           '5. Reporta el incidente a la mesa de servicios.',
                 icono='\U0001F310', autor='Soporte Técnico', activo=True),
    ])


def unseed_data(apps, schema_editor):
    """Reverse: eliminar datos en orden inverso para respetar FKs."""
    apps.get_model('conocimiento', 'Articulo').objects.all().delete()
    apps.get_model('notificaciones', 'Notificacion').objects.all().delete()
    apps.get_model('comentarios', 'TicketComentario').objects.all().delete()
    apps.get_model('soluciones', 'Solucion').objects.all().delete()
    apps.get_model('historial', 'HistorialEstado').objects.all().delete()
    apps.get_model('tickets', 'Ticket').objects.all().delete()
    apps.get_model('usuarios', 'Administrador').objects.all().delete()
    apps.get_model('usuarios', 'TecnicoTI').objects.all().delete()
    apps.get_model('usuarios', 'Colaborador').objects.all().delete()
    apps.get_model('usuarios', 'Persona').objects.all().delete()
    apps.get_model('tickets', 'Categoria').objects.all().delete()
    apps.get_model('tickets', 'Prioridad').objects.all().delete()
    apps.get_model('tickets', 'EstadoTicket').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
        ('usuarios', '0001_initial'),
        ('historial', '0002_initial'),
        ('soluciones', '0002_initial'),
        ('comentarios', '0002_initial'),
        ('notificaciones', '0002_initial'),
        ('conocimiento', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data, unseed_data),
    ]
