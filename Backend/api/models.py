from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# ----------------------
# USUARIOS
# ----------------------
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
        return self.create_user(correo, nombre_usuario, password, **extra_fields)


class Usuarios(AbstractBaseUser, PermissionsMixin):
    correo = models.EmailField(unique=True)
    nombre_usuario = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.correo


# ----------------------
# CIUDADES Y BUSES
# ----------------------
class Ciudades(models.Model):
    nombre = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.nombre


class Buses(models.Model):
    nombre = models.CharField(max_length=100)   # Empresa o identificación
    capacidad = models.IntegerField(default=40)

    def __str__(self):
        return f"{self.nombre} (Capacidad: {self.capacidad})"


# ----------------------
# VIAJES Y RESERVAS
# ----------------------
class Viajes(models.Model):
    bus = models.ForeignKey(Buses, on_delete=models.CASCADE, related_name="viajes")
    origen = models.ForeignKey(Ciudades, on_delete=models.CASCADE, related_name="viajes_origen")
    destino = models.ForeignKey(Ciudades, on_delete=models.CASCADE, related_name="viajes_destino")
    fecha_salida = models.DateTimeField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.origen} → {self.destino} ({self.fecha_salida}) - ${self.precio}"


class Reservas(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name="reservas")
    viaje = models.ForeignKey(Viajes, on_delete=models.CASCADE, related_name="reservas")
    asiento = models.IntegerField(null=True, blank=True)  # opcional: número de asiento
    pagado = models.BooleanField(default=False)

    def __str__(self):
        return f"Reserva {self.id} - {self.usuario.nombre_usuario} - {self.viaje}"
