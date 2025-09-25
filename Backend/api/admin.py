from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Usuarios)
admin.site.register(Paises)
admin.site.register(Ciudades)
admin.site.register(Autos)
admin.site.register(Hoteles)
admin.site.register(Paquetes)
admin.site.register(Carritos)
admin.site.register(Reservas_usuario)
admin.site.register(Pagos)
admin.site.register(Facturas)
admin.site.register(Historica)


admin.site.register(Buses)
admin.site.register(Viajes)
admin.site.register(AsientosBus)