from django.db import models


class HistorialEstado(models.Model):
    ticket = models.ForeignKey(
        'tickets.Ticket', on_delete=models.CASCADE,
        related_name='historial_estados', db_column='id_ticket'
    )
    estado_anterior = models.ForeignKey(
        'tickets.EstadoTicket', null=True, blank=True,
        on_delete=models.RESTRICT, related_name='historial_como_anterior',
        db_column='id_estado_anterior'
    )
    estado_nuevo = models.ForeignKey(
        'tickets.EstadoTicket', on_delete=models.RESTRICT,
        related_name='historial_como_nuevo', db_column='id_estado_nuevo'
    )
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    usuario_cambio = models.ForeignKey(
        'usuarios.Persona', on_delete=models.RESTRICT, db_column='usuario_cambio'
    )

    def __str__(self):
        ant = self.estado_anterior.nombre if self.estado_anterior else '(ninguno)'
        return f'Ticket #{self.ticket.id}: {ant} → {self.estado_nuevo.nombre}'

    class Meta:
        db_table = 'historial_estado'
        verbose_name = 'Historial de Estado'
        verbose_name_plural = 'Historial de Estados'
        ordering = ['-fecha_cambio']
