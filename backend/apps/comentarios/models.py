from django.db import models


class TicketComentario(models.Model):
    ticket = models.ForeignKey(
        'tickets.Ticket', on_delete=models.CASCADE,
        related_name='comentarios', db_column='id_ticket'
    )
    persona = models.ForeignKey(
        'usuarios.Persona', on_delete=models.RESTRICT, db_column='id_persona'
    )
    mensaje = models.CharField(max_length=500)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comentario de {self.persona.nombre} en Ticket #{self.ticket.id}'

    class Meta:
        db_table = 'ticket_comentario'
        verbose_name = 'Comentario de Ticket'
        verbose_name_plural = 'Comentarios de Ticket'
        ordering = ['fecha_registro']
