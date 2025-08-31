from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import *

Usuarios = get_user_model()

# ----------------------
# AUTENTICACIÓN
# ----------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'}, label='Confirmar contraseña')

    class Meta:
        model = Usuarios
        fields = ('correo', 'nombre_usuario', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Usuarios.objects.create_user(
            correo=validated_data['correo'],
            nombre_usuario=validated_data['nombre_usuario'],
            password=validated_data['password']
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Usuarios.USERNAME_FIELD  

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'correo': self.user.correo,
            'nombre_usuario': self.user.nombre_usuario,
        })
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'correo', 'nombre_usuario', 'is_staff']


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        correo = data.get('correo')
        password = data.get('password')

        if correo and password:
            user = authenticate(correo=correo, password=password)
            if user is None:
                raise serializers.ValidationError("Credenciales inválidas.")
            if not user.activo:
                raise serializers.ValidationError("Usuario no activo.")
        else:
            raise serializers.ValidationError("Debe proveer correo y contraseña.")

        data['user'] = user
        return data


# ----------------------
# CIUDADES Y BUSES
# ----------------------
class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudades
        fields = ['id', 'nombre']


class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buses
        fields = ['id', 'nombre', 'capacidad']


# ----------------------
# VIAJES Y RESERVAS
# ----------------------
class ViajeSerializer(serializers.ModelSerializer):
    origen_nombre = serializers.CharField(source='origen.nombre', read_only=True)
    destino_nombre = serializers.CharField(source='destino.nombre', read_only=True)
    bus_nombre = serializers.CharField(source='bus.nombre', read_only=True)

    class Meta:
        model = Viajes
        fields = ['id', 'bus', 'bus_nombre', 'origen', 'origen_nombre', 'destino', 'destino_nombre', 'fecha_salida', 'precio']


class ReservaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_usuario', read_only=True)
    viaje_info = serializers.StringRelatedField(source='viaje', read_only=True)

    class Meta:
        model = Reservas
        fields = ['id', 'usuario', 'usuario_nombre', 'viaje', 'viaje_info', 'asiento', 'pagado']
