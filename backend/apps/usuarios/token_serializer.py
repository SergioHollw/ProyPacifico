from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class PersonaTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        password_field = self.fields.pop('password')
        password_field.source = None
        self.fields['contrasena'] = password_field

    def validate(self, attrs):
        attrs['password'] = attrs.pop('contrasena')
        return super().validate(attrs)


class PersonaTokenObtainPairView(TokenObtainPairView):
    serializer_class = PersonaTokenObtainPairSerializer
