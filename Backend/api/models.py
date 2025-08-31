from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('activo', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(correo, nombre_usuario, password, **extra_fields)

class Usuarios(AbstractBaseUser, PermissionsMixin):
    correo = models.EmailField(unique=True)
    nombre_usuario = models.CharField(max_length=100, unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    codigo_activacion = models.IntegerField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.correo

class Paises(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True, null=False, blank=False)

    def __str__(self):
        return self.nombre

class Ciudades(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80, null=False, blank=False)
    pais = models.ForeignKey(Paises, on_delete=models.DO_NOTHING)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)

    def __str__(self):
        return f"{self.nombre}, {self.pais.nombre}"

class Autos(models.Model):
    id = models.AutoField(primary_key=True)
    marca = models.CharField(max_length=50, null=False, blank=False)
    modelo = models.CharField(max_length=50, null=False, blank=False)
    color = models.CharField(max_length=30, null=False, blank=False)
    precio_dia = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.color}) - ${self.precio_dia}/día"

class Hoteles(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    ciudad = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='hoteles')
    descripcion = models.TextField(null=True, blank=True)
    personas = models.IntegerField(null=False, blank=False, default=1)
    precio_noche = models.IntegerField(null=False, blank=False)
    direccion = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} - {self.ciudad.nombre} (${self.precio_noche}/noche)"


class Buses(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    nombre = models.CharField(max_length=100, null=False)
    costo_km = models.IntegerField(null=False)  # Costo por kilómetro unificado
    capacidad_bus = models.IntegerField(default=1)
    asientos_vip = models.IntegerField(default=0)  # Si se quiere mantener la categoría VIP
    asientos_general = models.IntegerField()

    def __str__(self):
        return f"{self.nombre} - Capacidad: {self.capacidad_bus} (VIP: {self.asientos_vip}, General: {self.asientos_general})"


class Viajes(models.Model):
    id = models.AutoField(primary_key=True)
    bus = models.ForeignKey(Buses, on_delete=models.DO_NOTHING, related_name='viajes')
    origen = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='viajes_orig')
    destino = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='viajes_destino')
    fecha_salida = models.DateTimeField(null=True, blank=True)
    fecha_llegada = models.DateTimeField(null=True, blank=True)
    distancia_km = models.IntegerField(default=0)  # Distancia del viaje en km
    precio_base = models.IntegerField(default=0)  # Precio base calculado según distancia y costo_km

    def __str__(self):
        return f"Viaje {self.id} - {self.origen.nombre} a {self.destino.nombre} - {self.fecha_salida}"

# Cambiamos Asientos para que sea para buses
class AsientosBus(models.Model):
    id = models.AutoField(primary_key=True)
    vip = models.BooleanField(default=False)
    reservado = models.BooleanField(default=False)
    numero = models.IntegerField(null=False, blank=False, default=0)
    viaje = models.ForeignKey(Viajes, on_delete=models.DO_NOTHING, related_name='asientos_bus')

    def __str__(self):
        return f"Asiento {self.numero} - {'VIP' if self.vip else 'General'} - {'Reservado' if self.reservado else 'Disponible'} - Viaje: {self.viaje.id}"

class Paquetes(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='paquetes')
    descripcion = models.TextField(null=True, blank=True)
    personas = models.IntegerField(null=False, blank=False)

    
    asiento_ida = models.ManyToManyField(AsientosBus, related_name='paquetes_asiento_ida', blank=True)
    asiento_vuelta = models.ManyToManyField(AsientosBus, related_name='paquetes_asiento_vuelta', blank=True)

    viaje_ida = models.ForeignKey(Viajes, on_delete=models.DO_NOTHING, related_name='paquetes_ida')
    viaje_vuelta = models.ForeignKey(Viajes, on_delete=models.DO_NOTHING, related_name='paquetes_vuelta')

    auto = models.ForeignKey(Autos, on_delete=models.DO_NOTHING, null=True, blank=True)
    hotel = models.ForeignKey(Hoteles, on_delete=models.DO_NOTHING, null=True, blank=True)
    pagado = models.BooleanField(default=False)
    total = models.FloatField(null=False, blank=True)

    def __str__(self):
        return f"Paquete {self.id} - Destino: {self.viaje_ida.destino.nombre}"

class Carritos(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='carritos')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Carrito de {self.id_usuario.nombre_usuario} - Total: ${self.total}"

class Reservas_usuario(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='reservas_usuario')
    paquete = models.ForeignKey(Paquetes, on_delete=models.CASCADE, related_name='paquete')

    def __str__(self):
        return f"Reserva {self.id} - Usuario: {self.usuario.nombre_usuario} - Paquete: {self.paquete.id}"

class Pagos(models.Model):
    id = models.AutoField(primary_key=True)
    paquete = models.ForeignKey(Paquetes, on_delete=models.CASCADE, related_name='pagos')
    fecha_pago = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    estado = models.CharField(max_length=20, choices=[
        ('PENDIENTE', 'Pendiente'),
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado')
    ], default='PENDIENTE')

    def __str__(self):
        return f"Pago {self.id} - Paquete: {self.paquete.id} - Monto: ${self.monto} - Estado: {self.estado}"

class Historica(models.Model):
    paquete = models.ForeignKey(Paquetes, on_delete=models.CASCADE, related_name='historica')
    fecha = models.DateTimeField(auto_now_add=True)
    pago = models.ForeignKey(Pagos, on_delete=models.DO_NOTHING, related_name='historica')
    factura = models.ForeignKey('Facturas', on_delete=models.DO_NOTHING, related_name='historica')

class Facturas(models.Model):
    id = models.AutoField(primary_key=True)
    pago = models.ForeignKey(Pagos, on_delete=models.DO_NOTHING, related_name='facturas')
    fecha_factura = models.DateTimeField(auto_now_add=True)
    razon_social = models.CharField(max_length=255, null=False, blank=False)
    cuil = models.CharField(max_length=20, null=False, blank=False)
    provincia = models.CharField(max_length=100, null=False, blank=False)
    ciudad = models.CharField(max_length=100, null=False, blank=False)
    calle = models.CharField(max_length=255, null=False, blank=False)
    numero_calle = models.CharField(max_length=20, null=False, blank=False)
    piso = models.CharField(max_length=10, null=True, blank=True)
    departamento = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"Factura {self.id} - Pago: {self.pago.id} - Fecha: {self.fecha_factura.strftime('%Y-%m-%d %H:%M:%S')}"