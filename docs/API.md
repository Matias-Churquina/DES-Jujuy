# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
La mayoría de los endpoints requieren autenticación JWT.

### Headers
```
Authorization: Bearer <token>
```

## Endpoints

### Auth
- `POST /auth/login` - Login con email/password
- `POST /auth/register` - Registro de usuario
- `POST /auth/google` - Login con Google
- `POST /auth/refresh` - Refrescar token
- `POST /auth/logout` - Logout

### Usuarios
- `GET /users/me` - Obtener usuario actual
- `PATCH /users/me` - Actualizar perfil
- `GET /users/:id` - Obtener usuario por ID

### Remiserías (Multi-tenant)
- `POST /remiserias` - Crear remisería
- `GET /remiserias` - Listar remiserías
- `GET /remiserias/:id` - Obtener remisería
- `PATCH /remiserias/:id` - Actualizar remisería
- `DELETE /remiserias/:id` - Eliminar remisería

### Choferes
- `GET /choferes` - Listar choferes (por remisería)
- `POST /choferes` - Crear chofer
- `GET /choferes/:id` - Obtener chofer
- `PATCH /choferes/:id` - Actualizar chofer
- `PATCH /choferes/:id/estado` - Cambiar estado (DISPONIBLE/EN_VIAJE/DESCANSO)
- `PATCH /choferes/:id/ubicacion` - Actualizar GPS
- `GET /choferes/:id/viajes` - Viajes del chofer
- `GET /choferes/:id/autos` - Autos del chofer

### Pasajeros
- `GET /pasajeros` - Listar pasajeros
- `POST /pasajeros` - Crear pasajero
- `GET /pasajeros/:id` - Obtener pasajero
- `PATCH /pasajeros/:id` - Actualizar pasajero
- `GET /pasajeros/:id/historial` - Historial de reservas

### Autos
- `GET /autos` - Listar autos (por remisería)
- `POST /autos` - Crear auto
- `GET /autos/:id` - Obtener auto
- `PATCH /autos/:id` - Actualizar auto
- `PATCH /autos/:id/estado` - Cambiar estado

### Viajes
- `GET /viajes` - Listar viajes
- `POST /viajes` - Crear viaje
- `GET /viajes/:id` - Obtener viaje
- `PATCH /viajes/:id/estado` - Cambiar estado (ABIERTO/EN_CURSO/FINALIZADO/CANCELADO)
- `GET /viajes/disponibles` - Buscar viajes disponibles
- `POST /viajes/:id/actualizar-asientos` - Actualizar asientos disponibles

### Reservas
- `GET /reservas` - Listar reservas
- `POST /reservas` - Crear reserva
- `GET /reservas/:id` - Obtener reserva
- `PATCH /reservas/:id/cancelar` - Cancelar reserva
- `PUT /reservas/:id/pago-efectivo` - Registrar pago en efectivo
- `POST /reservas/:id/qr` - Generar QR de cobro

### Paquetes
- `GET /paquetes` - Listar paquetes
- `POST /paquetes` - Crear paquete
- `GET /paquetes/:id` - Obtener paquete
- `PATCH /paquetes/:id/estado` - Cambiar estado
- `GET /paquetes/:codigo` - Buscar por código de seguimiento

### Trazabilidad
- `GET /paquetes/:id/trazabilidad` - Historial de tracking de un paquete
- `POST /trazabilidad` - Registrar punto de tracking

### Pagos
- `POST /pagos/mercadopago/create-preference` - Crear preferencia de pago
- `POST /pagos/mercadopago/webhook` - Webhook de MercadoPago

### Ubicación
- `POST /ubicacion/chofer/:id` - Actualizar ubicación chofer
- `POST /ubicacion/pasajero/:id` - Actualizar ubicación pasajero
- `GET /ubicacion/choferes-cercanos` - Choferes cercanos a un punto

## Socket.io Events

### Cliente → Servidor
- `unirse_pasajero` - Unirse a room de pasajero
- `unirse_chofer` - Unirse a room de chofer
- `unirse_viaje` - Unirse a room de viaje
- `unirse_reserva` - Unirse a room de reserva

### Servidor → Cliente
- `reserva_creada_viaje_{idViaje}` - Nueva reserva en viaje
- `pago_confirmado_reserva_{idReserva}` - Pago confirmado
- `viaje_actualizado_{idViaje}` - Estado de viaje actualizado
- `ubicacion_chofer_viaje_{idViaje}` - Ubicación chofer actualizada
- `asientos_actualizados_viaje_{idViaje}` - Asientos actualizados
- `qr_generado_reserva_{idReserva}` - QR generado
- `reserva_cancelada_{idReserva}` - Reserva cancelada
