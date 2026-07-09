from django.db import models


class Prioridad(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    nivel = models.IntegerField()

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'prioridad'
        verbose_name = 'Prioridad'
        verbose_name_plural = 'Prioridades'
        ordering = ['nivel']


class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'categoria'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'


class EstadoTicket(models.Model):
    nombre = models.CharField(max_length=50)
    codigo = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'estado_ticket'
        verbose_name = 'Estado de Ticket'
        verbose_name_plural = 'Estados de Ticket'


class Ticket(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    prioridad = models.ForeignKey(
        Prioridad, on_delete=models.RESTRICT, db_column='id_prioridad'
    )
    categoria = models.ForeignKey(
        Categoria, on_delete=models.RESTRICT, db_column='id_categoria'
    )
    usuario = models.ForeignKey(
        'usuarios.Colaborador', on_delete=models.RESTRICT,
        related_name='tickets_creados', db_column='id_usuario'
    )
    tecnico = models.ForeignKey(
        'usuarios.TecnicoTI', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='tickets_asignados',
        db_column='id_tecnico'
    )
    estado = models.ForeignKey(
        EstadoTicket, on_delete=models.RESTRICT,
        db_column='id_estado'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Ticket #{self.id} - {self.titulo}'

    class Meta:
        db_table = 'ticket'
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
        ordering = ['-fecha_registro']


class TicketAdjunto(models.Model):
    ticket = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, db_column='id_ticket',
        related_name='adjuntos'
    )
    nombre_archivo = models.CharField(max_length=255)
    ruta_archivo = models.CharField(max_length=500)
    tipo_archivo = models.CharField(max_length=100, blank=True, default='')
    tamanio = models.IntegerField(null=True, blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Adjunto #{self.id} - {self.nombre_archivo}'

    class Meta:
        db_table = 'ticket_adjunto'
        verbose_name = 'Adjunto de Ticket'
        verbose_name_plural = 'Adjuntos de Ticket'
