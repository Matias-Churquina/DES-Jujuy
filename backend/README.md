# DES Backend - Demo

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar base de datos
```bash
# Crear base de datos en PostgreSQL
createdb des_db

# O con pgAdmin:
# - Host: localhost
# - Port: 5432
# - User: postgres
# - Password: postgres
# - Database: des_db
```

### 3. Ejecutar seed (datos demo)
```bash
npm run seed
```

### 4. Iniciar servidor
```bash
npm run start:dev
```

### 5. Verificar API
```bash
# Documentación Swagger
http://localhost:3000/api/docs

# Health check
curl http://localhost:3000/api/users
```

## 🧪 Usuarios Demo

### Admin
- Email: `admin@des.com`
- Password: `demo123`

### Choferes
- Email: `carlos.chofer@des.com` / Password: `demo123`
- Email: `miguel.chofer@des.com` / Password: `demo123`

### Pasajeros
- Email: `ana.pasajero@des.com` / Password: `demo123`
- Email: `luis.pasajero@des.com` / Password: `demo123`

## 📡 Endpoints Principales

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuario actual

### Remiserías
- `GET /api/remiserias` - Listar
- `POST /api/remiserias` - Crear
- `GET /api/remiserias/:id` - Obtener

### Choferes
- `GET /api/choferes` - Listar
- `GET /api/choferes/:id` - Obtener
- `PATCH /api/choferes/:id/estado` - Cambiar estado
- `PATCH /api/choferes/:id/ubicacion` - Actualizar GPS
- `GET /api/choferes/:id/viajes` - Viajes del chofer

### Viajes
- `GET /api/viajes` - Listar
- `GET /api/viajes/disponibles` - Buscar disponibles
- `POST /api/viajes` - Crear
- `PATCH /api/viajes/:id/estado` - Cambiar estado

## 🔌 WebSocket

### Conectar
```javascript
const socket = io('http://localhost:3000/des');

// Unirse a rooms
socket.emit('join', {
  userId: '1',
  type: 'chofer',
  id: '1'
});
```

### Eventos
- `reserva_creada_viaje_{idViaje}` - Nueva reserva
- `pago_confirmado_reserva_{idReserva}` - Pago confirmado
- `viaje_actualizado_{idViaje}` - Viaje actualizado
- `ubicacion_chofer_viaje_{idViaje}` - Ubicación actualizada

## 🗄️ Base de Datos

### Entidades
- `usuarios` - Usuarios base
- `remiserias` - Multi-tenant
- `choferes` - Choferes
- `pasajeros` - Pasajeros
- `autos` - Autos
- `viajes` - Viajes
- `reservas` - Reservas
- `paquetes` - Paquetes
- `trazabilidad_paquetes` - Tracking

## 🐛 Troubleshooting

### Error de conexión a DB
```bash
# Verificar que PostgreSQL esté corriendo
pg_ctl status

# Crear base de datos manualmente
psql -U postgres -c "CREATE DATABASE des_db;"
```

### Error de puerto ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

## 📱 Frontend Mobile

El backend está listo para conectar con el app React Native en `../mobile/`.

Para desarrollo, el frontend deberá configurar:
- API_URL: `http://localhost:3000/api`
- SOCKET_URL: `http://localhost:3000/des`

## 🔐 Seguridad

- JWT tokens válidos por 7 días
- Passwords hasheados con bcrypt
- CORS configurado
- Input validation con class-validator

## 📝 Notas

- Esta es una versión DEMO para presentación
- Datos de prueba incluidos en seed
- MercadoPago y Firebase en modo demo
- GPS implementado pero requiere permisos en mobile
