from django.contrib import admin
from django.urls import path, include
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),

    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('log_code/', views.log_code, name='log_code'),

    path('crear_persona/', views.crear_persona, name='crear_persona'),
    path('crear_paquete/', views.crear_paquete, name='crear_paquete'),
    path('admin_crear_paquete/', views.admin_crear_paquete, name='admin_crear_paquete'),
    path('hacer_pago/', views.realizar_pago, name='hacer_pago'),

    path('crear_pais/', views.crear_pais, name='crear_pais'),
    path('crear_ciudad/', views.crear_ciudad, name='crear_ciudad'),
    path('crear_auto/', views.crear_auto, name='crear_auto'),
    path('crear_hotel/', views.crear_hotel, name='crear_hotel'),
    path('crear_avion/', views.crear_avion, name='crear_avion'),
    path('crear_vuelo/', views.crear_vuelo, name='crear_vuelo'),
    path('crear_asiento/', views.crear_asiento, name='crear_asiento'),
    path('anular_pedido/<int:paquete_id>/', views.anular_pedido, name='anular_pedido'),

    path('conseguir_mi_usuario/', views.get_my_user, name='conseguir_mi_usuario'),
    path('conseguir_carrito/', views.get_carrito, name='conseguir_carrito'),
    path('conseguir_mis_reservas/', views.get_reservas_usuario, name='conseguir_mis_reservas'),
    path('conseguir_mis_reservas_pendientes/', views.get_paquetes_pendientes_usuario, name='conseguir_mis_reservas_pendientes'),
    path('conseguir_autos/', views.get_autos, name='conseguir_autos'),
    path('conseguir_hoteles/', views.get_hoteles, name='conseguir_hoteles'),
    path('conseguir_paises/', views.get_paises, name='conseguir_paises'),
    path('conseguir_ciudades/', views.get_ciudades, name='conseguir_ciudades'),
    path('conseguir_paquetes_en_venta/', views.get_paquetes_en_venta, name='conseguir_paquetes_en_venta'),
    path('conseguir_paquetes_lista/', views.conseguir_paquetes_en_venta, name='conseguir_paquetes_lista'),
    path('buscar_hoteles/', views.buscar_hoteles, name='buscar_hoteles'),
    path('obtener_paquetes_search/', views.obtener_paquetes_search, name='obtener_paquetes_search'),
    path('obtener_vuelos_personalizados/', views.get_vuelos_personalizados, name='get_vuelos_personalizados'),
    path('cotizar_vuelo/', views.calcular_cotizacion_vuelo),
    path('conseguir_hotel_ciudad/', views.get_hotel_ciudad, name='conseguir_hotel_ciudad'),

    path('conseguir_personas/', views.get_personas, name='conseguir_personas'),
    path('conseguir_paquetes_pendientes/', views.get_paquetes_pendientes, name='conseguir_paquetes_pendientes'),
    path('conseguir_facturas/', views.ver_facturas_a_cobrar, name='conseguir_facturas'), 
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('busqueda/', views.busqueda_general, name='busqueda_general'),


    path('eliminar_paquete/<int:paquete_id>/', views.eliminar_paquete, name='eliminar_paquete'),


    path('conseguir_vuelos/', views.get_vuelos, name='conseguir_vuelos'),
    path('conseguir_aviones/', views.get_aviones, name='conseguir_aviones'),
    path('conseguir_asientos/', views.get_asientos, name='conseguir_asientos'),
    path('conseguir_pagos/', views.get_pagos, name='conseguir_pagos'),
    path('conseguir_asientos_vuelo/<int:vuelo_id>/', views.get_asientos_vuelo, name='conseguir_asientos_vuelos'),


    path('actualizar_vuelo/<int:vuelo_id>/', views.actualizar_vuelo, name='actualizar_vuelo'),
    path('actualizar_paquete/<int:paquete_id>/', views.actualizar_paquete, name='actualizar_paquete'),
    path('actualizar_hotel/<int:hotel_id>/', views.actualizar_hotel, name='actualizar_hotel'),
    path('actualizar_auto/<int:auto_id>/', views.actualizar_auto, name='actualizar_auto'),
    path('actualizar_avion/<int:avion_id>/', views.actualizar_avion, name='actualizar_avion'),
    path('actualizar_pais/<int:pais_id>/', views.actualizar_pais, name='actualizar_pais'),
    path('actualizar_ciudad/<int:ciudad_id>/', views.actualizar_ciudad, name='actualizar_ciudad')
]
