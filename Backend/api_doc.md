
# 📌 Endpoints de la API Volaya

## 🔐 Autenticación
| Método | Endpoint             | Permisos       | Descripción                          |
|--------|----------------------|----------------|--------------------------------------|
| POST   | `/register/`         | Público        | Registro de nuevos usuarios          |
| POST   | `/login/`            | Público        | Inicio de sesión                     |
| POST   | `/log_code/`         | Público        | Validación de código de activación   |

## 👤 Usuario
| Método | Endpoint                     | Permisos          | Descripción                          |
|--------|------------------------------|-------------------|--------------------------------------|
| GET    | `/conseguir_mi_usuario/`     | Usuario autenticado | Obtener datos del usuario actual    |
| POST   | `/crear_persona/`            | Usuario autenticado | Crear perfil personal               |

## ✈️ Paquetes
| Método | Endpoint                             | Permisos          | Descripción                          |
|--------|--------------------------------------|-------------------|--------------------------------------|
| POST   | `/crear_paquete/`                    | Usuario autenticado | Crear nuevo paquete de viaje        |
| POST   | `/obtener_paquetes_search/`          | Usuario autenticado | Buscar/cotizar paquetes             |
| GET    | `/conseguir_paquetes_en_venta/`      | Usuario autenticado | Listar paquetes disponibles         |
| PUT    | `/modificar_paquete/<int:paquete_id>/` | Usuario autenticado | Modificar paquete existente         |
| DELETE | `/eliminar_paquete/<int:paquete_id>/` | Usuario autenticado | Eliminar paquete                    |
| POST   | `/pago_aprobado/`                    | Usuario autenticado | Confirmar pago de paquete           |

## 🛒 Carrito y Reservas
| Método | Endpoint                     | Permisos          | Descripción                          |
|--------|------------------------------|-------------------|--------------------------------------|
| GET    | `/conseguir_carrito/`        | Usuario autenticado | Ver contenido del carrito           |
| GET    | `/conseguir_mis_reservas/`   | Usuario autenticado | Listar reservas del usuario         |

## 📦 Catálogos
| Método | Endpoint                     | Permisos          | Descripción                          |
|--------|------------------------------|-------------------|--------------------------------------|
| GET    | `/conseguir_paises/`         | Usuario autenticado | Listar países disponibles           |
| GET    | `/conseguir_ciudades/`       | Usuario autenticado | Listar ciudades disponibles         |
| GET    | `/conseguir_autos/`          | Usuario autenticado | Listar autos disponibles            |
| GET    | `/conseguir_hoteles/`        | Usuario autenticado | Listar hoteles disponibles          |
| GET    | `/buscar_hoteles/`           | Usuario autenticado | Buscar hoteles por ubicación        |

## 👔 Administración (Solo Staff)
| Método | Endpoint                             | Permisos  | Descripción                          |
|--------|--------------------------------------|-----------|--------------------------------------|
| POST   | `/crear_pais/`                       | Staff     | Crear nuevo país                    |
| POST   | `/crear_ciudad/`                     | Staff     | Crear nueva ciudad                  |
| POST   | `/crear_auto/`                       | Staff     | Crear nuevo auto                    |
| POST   | `/crear_hotel/`                      | Staff     | Crear nuevo hotel                   |
| POST   | `/anular_pedido/<int:paquete_id>/`   | Staff     | Anular pedido confirmado            |
| GET    | `/conseguir_personas/`               | Staff     | Listar todas las personas           |
| GET    | `/conseguir_paquetes_pendientes/`    | Staff     | Ver paquetes pendientes de pago     |
| GET    | `/conseguir_facturas/`               | Staff     | Listar facturas por cobrar          |

## 🔄 Parámetros URL
Algunos endpoints aceptan parámetros:
- `GET /buscar_hoteles/?search=buenos` (búsqueda por texto)
- `GET /conseguir_facturas/?ordenar_por=fecha` (ordenar por fecha o cliente)

## 📌 Notas importantes
1. **Autenticación requerida** en todos los endpoints excepto:
   - `/register/`
   - `/login/` 
   - `/log_code/`

2. **Headers necesarios**:
   ```http
   Authorization: Bearer <token_jwt>
   Content-Type: application/json