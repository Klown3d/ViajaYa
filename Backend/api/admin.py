from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Usuarios)
admin.site.register(Paises)
admin.site.register(Ciudades)
admin.site.register(Autos)
admin.site.register(Vuelos)
admin.site.register(Aviones)
admin.site.register(Hoteles)
admin.site.register(Paquetes)
admin.site.register(Carritos)
admin.site.register(Reservas_usuario)