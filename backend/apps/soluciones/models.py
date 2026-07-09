from django.db import models


class Solucion(models.Model):
    ticket = models.OneToOneField(
        'tickets.Ticket', on_delete=models.CASCADE,
        related_name='solucion', db_column='id_ticket'
    )
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    tecnico = models.ForeignKey(
        'usuarios.TecnicoTI', on_delete=models.RESTRICT, db_column='id_tecnico'
    )

    def __str__(self):
        return f'Solución para Ticket #{self.ticket.id}'

    class Meta:
        db_table = 'solucion'
        verbose_name = 'Solución'
        verbose_name_plural = 'Soluciones'
