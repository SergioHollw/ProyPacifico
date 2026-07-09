from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class PersonaManager(models.Manager):
    def create_user(self, correo, nombre, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        persona = self.model(correo=correo, nombre=nombre, **extra_fields)
        persona.set_password(password)
        persona.save(using=self._db)
        return persona


class Persona(models.Model):
    ROLES = [
        ('COLABORADOR', 'Colaborador'),
        ('TECNICO', 'Técnico TI'),
        ('ADMINISTRADOR', 'Administrador'),
    ]

    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True, max_length=150)
    contrasena = models.CharField(max_length=255)
    rol = models.CharField(max_length=20, choices=ROLES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    objects = PersonaManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre']
    is_authenticated = True
    is_anonymous = False

    @property
    def is_active(self):
        return self.activo

    def set_password(self, raw_password):
        self.contrasena = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.contrasena)

    def __str__(self):
        return f'{self.nombre} ({self.get_rol_display()})'

    class Meta:
        db_table = 'persona'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'


class Colaborador(models.Model):
    persona = models.OneToOneField(
        Persona, on_delete=models.CASCADE, primary_key=True,
        related_name='perfil_colaborador', db_column='id',
    )
    area = models.CharField(max_length=100, blank=True)
    estado_cuenta = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'Colaborador: {self.persona.nombre}'

    class Meta:
        db_table = 'colaborador'
        verbose_name = 'Colaborador'
        verbose_name_plural = 'Colaboradores'


class TecnicoTI(models.Model):
    persona = models.OneToOneField(
        Persona, on_delete=models.CASCADE, primary_key=True,
        related_name='perfil_tecnico', db_column='id',
    )
    especialidad = models.CharField(max_length=100)
    disponibilidad = models.BooleanField(default=True)

    def __str__(self):
        return f'Tecnico: {self.persona.nombre} ({self.especialidad})'

    class Meta:
        db_table = 'tecnico_ti'
        verbose_name = 'Tecnico TI'
        verbose_name_plural = 'Tecnicos TI'


class Administrador(models.Model):
    persona = models.OneToOneField(
        Persona, on_delete=models.CASCADE, primary_key=True,
        related_name='perfil_admin', db_column='id',
    )
    nivel_acceso = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'Admin: {self.persona.nombre}'

    class Meta:
        db_table = 'administrador'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'
