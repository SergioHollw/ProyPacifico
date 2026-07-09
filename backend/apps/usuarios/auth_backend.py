from django.contrib.auth.backends import BaseBackend
from .models import Persona


class PersonaBackend(BaseBackend):
    def authenticate(self, request, correo=None, contrasena=None, **kwargs):
        if not correo:
            correo = kwargs.get('username')
        if not contrasena:
            contrasena = kwargs.get('password')
        if not correo or not contrasena:
            return None
        try:
            persona = Persona.objects.get(correo=correo, activo=True)
            if persona.check_password(contrasena):
                return persona
        except Persona.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return Persona.objects.get(pk=user_id)
        except Persona.DoesNotExist:
            return None
