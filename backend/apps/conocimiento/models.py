from django.db import models

class Articulo(models.Model):
    titulo = models.CharField(max_length=200)
    categoria = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=300)
    contenido = models.TextField()
    icono = models.CharField(max_length=10, default='📄')
    autor = models.CharField(max_length=100, default='Soporte Técnico')
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo

    class Meta:
        db_table = 'articulo'
        verbose_name = 'Artículo'
        verbose_name_plural = 'Artículos'
        ordering = ['-fecha_publicacion']
