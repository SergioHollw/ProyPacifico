from django.db import models


class Notificacion(models.Model):
    ticket = models.ForeignKey(
        'tickets.Ticket', on_delete=models.CASCADE,
        related_name='notificaciones', db_column='id_ticket'
    )
    destinatario = models.ForeignKey(
        'usuarios.Persona', on_delete=models.CASCADE,
        related_name='notificaciones', db_column='id_destinatario'
    )
    tipo = models.CharField(max_length=50, blank=True)
    mensaje = models.CharField(max_length=255, blank=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    def __str__(self):
        return f'Notificación para {self.destinatario.nombre} - Ticket #{self.ticket.id}'

    class Meta:
        db_table = 'notificacion'
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-fecha_envio']
