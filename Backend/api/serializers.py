from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

Usuarios = get_user_model()

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

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paises
        fields = ['id', 'nombre']

class CiudadSerializer(serializers.ModelSerializer):
    pais_nombre = serializers.CharField(source='pais.nombre', read_only=True)

    class Meta:
        model = Ciudades
        fields = ['id', 'nombre', 'pais', 'pais_nombre', 'latitud', 'longitud']

class AutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autos
        fields = ['id', 'marca', 'modelo', 'color', 'precio_dia']

class HotelSerializer(serializers.ModelSerializer):
    ciudad_nombre = serializers.CharField(source='ciudad.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='ciudad.pais.nombre', read_only=True)

    class Meta:
        model = Hoteles
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio_noche',
            'direccion',
            'personas',
            'ciudad',         
            'ciudad_nombre',
            'pais_nombre',
        ]

# Cambiamos AvionSerializer por BusSerializer
class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buses
        fields = '__all__'

# Cambiamos VueloSerializer por ViajeSerializer
class ViajeSerializer(serializers.ModelSerializer):
    origen_nombre = serializers.CharField(source='origen.nombre', read_only=True)
    destino_nombre = serializers.CharField(source='destino.nombre', read_only=True)
    
    class Meta:
        model = Viajes
        fields = ['id', 'bus', 'origen', 'origen_nombre', 'destino', 'destino_nombre', 'fecha_salida', 'fecha_llegada', 'distancia_km', 'precio_base']

class ViajeListSerializer(serializers.ModelSerializer):
    bus = serializers.CharField(source='bus.nombre', read_only=True)
    origen = serializers.CharField(source='origen.nombre', read_only=True)
    destino = serializers.CharField(source='destino.nombre', read_only=True)

    class Meta:
        model = Viajes
        fields = ['id', 'bus', 'origen', 'destino', 'fecha_salida', 'fecha_llegada', 'precio_base']

# Cambiamos AsientoSerializer por AsientoBusSerializer
class AsientoBusSerializer(serializers.ModelSerializer):
    viaje_info = serializers.StringRelatedField(source='viaje', read_only=True)

    class Meta:
        model = AsientosBus
        fields = ['id', 'vip', 'reservado', 'viaje', 'viaje_info', 'numero']

class PaqueteSerializer(serializers.ModelSerializer):
    # Cambiamos Asientos por AsientosBus
    asiento_ida = serializers.PrimaryKeyRelatedField(queryset=AsientosBus.objects.all(), many=True)
    asiento_vuelta = serializers.PrimaryKeyRelatedField(queryset=AsientosBus.objects.all(), many=True)
    descripcion = serializers.CharField(required=False, allow_blank=True) 

    class Meta:
        model = Paquetes
        fields = [
            'personas',
            'viaje_ida',
            'viaje_vuelta',
            'asiento_ida',
            'asiento_vuelta',
            'hotel',
            'auto',
            'total',
            'descripcion'
        ]

class AdminPaqueteSerializer(serializers.ModelSerializer):
    # Cambiamos referencias a vuelos por viajes
    viaje_ida = serializers.CharField(source='viaje_ida.bus', read_only=True)
    viaje_ida_fecha = serializers.DateTimeField(source='viaje_ida.fecha_salida', read_only=True)
    viaje_vuelta = serializers.CharField(source='viaje_vuelta.bus', read_only=True)
    viaje_vuelta_fecha = serializers.DateTimeField(source='viaje_vuelta.fecha_salida', read_only=True)

    viaje_ida_obj = ViajeSerializer(source='viaje_ida', read_only=True)
    viaje_vuelta_obj = ViajeSerializer(source='viaje_vuelta', read_only=True)

    auto = serializers.CharField(source='auto.modelo', read_only=True)
    auto_id = serializers.IntegerField(source='auto.id', read_only=True)

    hotel = serializers.CharField(source='hotel.nombre', read_only=True)
    hotel_id = serializers.IntegerField(source='hotel.id', read_only=True)

    # Cambiamos AsientoSerializer por AsientoBusSerializer
    asiento_ida = AsientoBusSerializer(many=True, read_only=True)
    asiento_vuelta = AsientoBusSerializer(many=True, read_only=True)

    class Meta:
        model = Paquetes
        fields = [
            'id',
            'descripcion',
            'personas',
            'viaje_ida',
            'viaje_ida_fecha',
            'viaje_vuelta',
            'viaje_vuelta_fecha',
            'viaje_ida_obj',  
            'viaje_vuelta_obj', 
            'hotel',
            'hotel_id',
            'auto',
            'auto_id',
            'total',
            'asiento_ida',
            'asiento_vuelta',
            'id_usuario',
        ]
        extra_kwargs = {
            'id_usuario': {'read_only': True}
        }

class CotizarPaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquetes
        fields = [
            'personas',
            'viaje_ida',
            'viaje_vuelta',
            'auto',
        ]
        read_only_fields = ['total']

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carritos
        fields = ['id_usuario', 'total']

class ReservaUsuarioSerializer(serializers.ModelSerializer):
    total_paquete = serializers.DecimalField(source='paquete.total', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Reservas_usuario
        fields = ['id', 'usuario', 'paquete', 'total_paquete']

class ReservaDetalleSerializer(serializers.ModelSerializer):
    # Cambiamos referencias a vuelos por viajes
    viaje_ida = serializers.SerializerMethodField()
    viaje_vuelta = serializers.SerializerMethodField()
    hotel = serializers.CharField(source='hotel.nombre', default=None)
    auto = serializers.SerializerMethodField()
    # Cambiamos asiento por asiento de bus
    asiento_ida = serializers.SerializerMethodField()
    asiento_vuelta = serializers.SerializerMethodField()

    class Meta:
        model = Paquetes
        fields = [
            'id',
            'descripcion',
            'personas',
            'viaje_ida',
            'viaje_vuelta',
            'hotel',
            'auto',
            'asiento_ida',
            'asiento_vuelta',
            'total',
            'pagado',
        ]

    # Actualizamos los métodos para usar viajes en lugar de vuelos
    def get_viaje_ida(self, obj):
        return f"{obj.viaje_ida.bus.nombre} - {obj.viaje_ida.origen.nombre} a {obj.viaje_ida.destino.nombre}"

    def get_viaje_vuelta(self, obj):
        return f"{obj.viaje_vuelta.bus.nombre} - {obj.viaje_vuelta.origen.nombre} a {obj.viaje_vuelta.destino.nombre}"

    def get_auto(self, obj):
        if obj.auto:
            return f"{obj.auto.marca} {obj.auto.modelo} ({obj.auto.color}) - ${obj.auto.precio_dia}/día"
        return None

    def get_asiento_ida(self, obj):
        return [f"Asiento {a.numero} - {'VIP' if a.vip else 'General'}" for a in obj.asiento_ida.all()]

    def get_asiento_vuelta(self, obj):
        return [f"Asiento {a.numero} - {'VIP' if a.vip else 'General'}" for a in obj.asiento_vuelta.all()]

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facturas
        fields = [
            'id',
            'pago',
            'fecha_factura',
            'razon_social',
            'cuil',
            'provincia',
            'ciudad',
            'calle',
            'numero_calle',
            'piso',
            'departamento'
        ]
        read_only_fields = ['fecha_factura']

class FacturaPendienteSerializer(serializers.ModelSerializer):
    cliente = serializers.CharField(source='id_usuario.nombre_usuario')
    total = serializers.DecimalField(max_digits=50, decimal_places=2)
    
    class Meta:
        model = Paquetes
        fields = ['id', 'cliente', 'total']
    
class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagos
        fields = ['id', 'paquete', 'fecha_pago', 'monto', 'estado']

class HistoricaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historica
        fields = ['id', 'paquete', 'fecha', 'pago', 'factura']