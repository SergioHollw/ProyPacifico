from rest_framework import serializers
from .models import Persona, Colaborador, TecnicoTI, Administrador


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id', 'nombre', 'correo', 'rol', 'activo', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']


class AdminRegistroSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    correo = serializers.EmailField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    rol = serializers.ChoiceField(choices=['COLABORADOR', 'TECNICO', 'ADMINISTRADOR'])
    area = serializers.CharField(max_length=100, required=False, allow_blank=True)
    especialidad = serializers.CharField(max_length=100, required=False, allow_blank=True)
    nivel_acceso = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_correo(self, value):
        if Persona.objects.filter(correo=value).exists():
            raise serializers.ValidationError('El correo ya está registrado')
        return value

    def create(self, validated_data):
        persona = Persona.objects.create_user(
            correo=validated_data['correo'],
            nombre=validated_data['nombre'],
            password=validated_data['password'],
            rol=validated_data['rol'],
        )
        if validated_data['rol'] == 'COLABORADOR':
            Colaborador.objects.create(
                persona=persona,
                area=validated_data.get('area', ''),
                estado_cuenta='ACTIVO',
            )
        elif validated_data['rol'] == 'TECNICO':
            TecnicoTI.objects.create(
                persona=persona,
                especialidad=validated_data.get('especialidad', ''),
                disponibilidad=True,
            )
        elif validated_data['rol'] == 'ADMINISTRADOR':
            Administrador.objects.create(
                persona=persona,
                nivel_acceso=validated_data.get('nivel_acceso', ''),
            )
        return persona


class CambioPasswordSerializer(serializers.Serializer):
    password_actual = serializers.CharField()
    password_nueva = serializers.CharField(min_length=6)
