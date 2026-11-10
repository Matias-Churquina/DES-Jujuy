# Arquitectura del Sistema

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         DES Platform                         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Mobile App   │    │ Mobile App   │    │ Mobile App   │
│ (Pasajero)   │    │ (Chofer)     │    │ (Admin)      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (NestJS)      │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Auth Module │    │ Business Logic│    │ Real-time    │
│  (JWT/GAuth) │    │  (Remiserías, │    │  (Socket.io) │
│              │    │   Choferes,   │    │              │
└──────────────┘    │   Viajes,     │    └──────────────┘
                    │   Paquetes)   │
                    └──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ PostgreSQL   │    │    Redis     │    │   Firebase    │
│  (Database)  │    │  (Cache/     │    │   (Push/      │
│              │    │   Queues)    │    │   Auth)       │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │ MercadoPago  │
                    │   (Pagos)    │
                    └──────────────┘
```

## Multi-Tenant Architecture

### Concepto
Cada remisería es un "tenant" independiente. Los datos están segregados por `idRemiseria`.

### Implementación
- **Remiserias**: Entidad principal de cada tenant
- **Guard**: `RemiseriaGuard` valida que las operaciones sean solo dentro del tenant
- **Decorator**: `@Remiseria()` inyecta el tenant actual en el controller
- **Query**: Todos los queries incluyen filtro por `idRemiseria`

### Ejemplo
```typescript
// Un chofer solo ve sus autos de su remisería
@Get('autos')
@UseGuards(JwtAuthGuard, RemiseriaGuard)
getAutos(@Remiseria() remiseria: Remiseria) {
  return this.autosService.findByRemiseria(remiseria.idRemiseria);
}
```

## Módulos del Backend

### Auth Module
- JWT authentication
- Google OAuth 2.0
- Password hashing (bcrypt)
- Refresh tokens

### Users Module
- Base user entity
- Roles: PASAJERO, CHOFER, ADMIN
- Profile management

### Remiserias Module
- CRUD de remiserías
- Multi-tenant management
- Configuration por remisería

### ChoferesModule
- Gestión de choferes
- Estados: DISPONIBLE, EN_VIAJE, DESCANSO, SUSPENDIDO
- GPS tracking
- Asignación de autos

### PasajerosModule
- Gestión de pasajeros
- Historial de viajes
- Calificaciones

### AutosModule
- Gestión de autos
- Estados: DISPONIBLE, EN_VIAJE, EN_TALLER, INACTIVO
- Capacidad y características

### ViajesModule
- Creación de viajes
- Estados: ABIERTO, EN_CURSO, FINALIZADO, CANCELADO
- Gestión de asientos
- Tarifas

### ReservasModule
- Reservas de pasajeros
- Estados: PENDIENTE, CONFIRMADA, CANCELADA, UTILIZADA
- Pagos integrados

### PaquetesModule
- Envío de paquetes
- Prioridades: NORMAL, URGENTE, FRAGIL
- Códigos de seguimiento
- Estados: PENDIENTE_RECOGIDA, EN_TRANSITO, ENTREGADO

### TrazabilidadModule
- Tracking de paquetes
- Historial de ubicaciones
- Timeline de estados

### UbicacionModule
- GPS tracking en tiempo real
- Geocoding
- Cálculo de distancias
- Choferes cercanos

### PagosModule
- Integración MercadoPago
- Generación de QR
- Links de pago
- Webhooks

### WebsocketModule
- Socket.io Gateway
- Rooms por viaje/reserva
- Eventos en tiempo real

### NotificacionesModule
- Firebase Cloud Messaging
- Push notifications
- Templates de notificaciones

## Mobile Architecture

### Redux Structure
```typescript
store/
├── index.ts
├── api/
│   ├── apiSlice.ts         # RTK Query base
│   ├── authApi.ts          # Auth endpoints
│   ├── choferApi.ts        # Chofer endpoints
│   ├── pasajeroApi.ts      # Pasajero endpoints
│   └── paquetesApi.ts      # Paquetes endpoints
└── slices/
    ├── authSlice.ts        # Auth state
    ├── userSlice.ts        # User state
    └── uiSlice.ts          # UI state (loading, modals)
```

### Navigation Structure
```typescript
Stack Navigator:
├── AuthStack (no autenticado)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── MainStack (autenticado)
    ├── PasajeroTabs
    │   ├── Home (buscar viajes)
    │   ├── Reservas (reservas activas)
    │   ├── Historial
    │   └── Perfil
    ├── ChoferTabs
    │   ├── Dashboard (viaje actual)
    │   ├── Autos
    │   ├── Historial
    │   └── Perfil
    └── AdminStack
        ├── Dashboard
        ├── Choferes
        ├── Viajes
        └── Reportes
```

### Component Structure
```
components/
├── ui/                      # Componentes base reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Loading.tsx
├── map/                     # Componentes de mapa
│   ├── CustomMap.tsx       # Mapa base personalizado
│   ├── Marker.tsx           # Marcador personalizado
│   ├── Route.tsx            # Ruta animada
│   └── Cluster.tsx          # Cluster de puntos
└── navigation/              # Componentes de navegación
    ├── BottomTab.tsx
    └── Header.tsx
```

## Database Schema

### Entidades Principales
- **usuarios**: Base users
- **remiserias**: Tenants
- **choferes**: Chofer profiles
- **pasajeros**: Pasajero profiles
- **admins**: Admin profiles
- **autos**: Autos por remisería
- **viajes**: Viajes
- **reservas**: Reservas
- **paquetes**: Paquetes
- **trazabilidad_paquetes**: Tracking de paquetes
- **auditoria**: Logs de cambios

### Relaciones
- Usuario → 1 Pasajero/Chofer/Admin
- Remiseria → N Choferes
- Remiseria → N Autos
- Chofer ↔ N Autos (through turnos)
- Chofer → N Viajes
- Auto → N Viajes
- Viaje → N Reservas
- Pasajero → N Reservas
- Paquete → N Trazabilidad

## Security

### Authentication
- JWT access tokens (15 min)
- Refresh tokens (7 days)
- Google OAuth 2.0

### Authorization
- Role-based access control (RBAC)
- Tenant isolation (multi-tenant)
- Route guards

### Data Protection
- Password hashing (bcrypt, 10 rounds)
- Input validation (class-validator)
- SQL injection prevention (TypeORM)
- XSS prevention (Sanitization)
- Rate limiting (express-rate-limit)
- CORS configuration
- Helmet (security headers)

## Real-time Communication

### Socket.io Events
- **Client → Server**: unirse a rooms (pasajero, chofer, viaje, reserva)
- **Server → Client**: actualizaciones en tiempo real de viajes, pagos, ubicación

### Rooms Pattern
- `pasajero_{idPasajero}`: Updates específicos al pasajero
- `chofer_{idChofer}`: Updates específicos al chofer
- `viaje_{idViaje}`: Updates del viaje (pasajeros + chofer)
- `reserva_{idReserva}`: Updates de la reserva

## Performance

### Backend
- Database indexing
- Query optimization
- Caching with Redis
- Connection pooling
- Lazy loading relations

### Mobile
- Redux persistence
- Image caching
- Lazy loading screens
- Code splitting
- Optimized re-renders (React.memo)
