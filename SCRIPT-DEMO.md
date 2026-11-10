# 🎬 SCRIPT DE PRESENTACIÓN - DEMO DES

## Preparación (5 minutos antes)

### Checklist Pre-Demo
- [ ] PostgreSQL corriendo
- [ ] Backend ejecutándose (`npm run start:dev`)
- [ ] Seed ejecutado (`npm run seed`)
- [ ] Mobile app corriendo (Android/iOS o web)
- [ ] Swagger abierto en navegador
- [ ] Terminal preparada para mostrar logs

## 🎯 Script de Presentación (10-15 minutos)

### 1. INTRODUCCIÓN (1 minuto)
**Decir:**
> "Hoy les presento DES - Destino Express Service, una plataforma multi-tenant para gestión de remises en San Salvador de Jujuy. El problema que resolvemos es que las remiserías necesitan monitorear sus choferes en tiempo real, permitir a los pasajeros reservar viajes, y gestionar el envío de paquetes con trazabilidad completa."

### 2. MOSTRAR BACKEND (3 minutos)

#### 2.1 Swagger Documentation
**Acción:** Abrir http://localhost:3000/api/docs
**Mostrar:**
- Documentación automática con Swagger
- Todos los endpoints disponibles
- Schemas de request/response
- Autenticación JWT

**Decir:**
> "El backend está construido con NestJS, un framework enterprise para Node.js. Tenemos documentación automática con Swagger que facilita la integración para desarrolladores."

#### 2.2 Demo de API
**Acción:** En Swagger, probar endpoint de login
```
POST /api/auth/login
{
  "email": "admin@des.com",
  "password": "demo123"
}
```

**Mostrar:**
- Response con JWT token
- Usuario con rol ADMIN
- Datos del usuario

**Decir:**
> "Tenemos autenticación JWT con 3 roles: admin, chofer y pasajero. Cada rol tiene su propio dashboard y funcionalidades específicas."

#### 2.3 Listar Choferes
**Acción:** En Swagger, probar endpoint de choferes
```
GET /api/choferes
```

**Mostrar:**
- Lista de choferes con datos reales
- GPS coordinates
- Estado actual (DISPONIBLE)
- Relación con usuario y remisería

**Decir:**
> "Los choferes tienen GPS integrado para tracking en tiempo real. Podemos ver su ubicación, estado y vehículos asignados."

### 3. MOSTRAR MOBILE APP (5 minutos)

#### 3.1 Login Screen
**Acción:** Abrir app móvil
**Mostrar:**
- Pantalla de login limpia y profesional
- Usuarios demo pre-cargados
- Login con credenciales

**Decir:**
> "La app móvil es React Native nativa, no una web-view. Tenemos login seguro con JWT y navegación automática según el rol del usuario."

#### 3.2 Demo por Rol

**A) Admin Dashboard**
```
Email: admin@des.com
Password: demo123
```

**Mostrar:**
- Estadísticas en tiempo real
- Choferes activos, viajes hoy, reservas pendientes
- Acceso a gestión completa

**Decir:**
> "El admin de la remisería tiene un dashboard completo con estadísticas de operación en tiempo real."

**B) Chofer Panel**
```
Email: carlos.chofer@des.com
Password: demo123
```

**Mostrar:**
- Estado actual (DISPONIBLE)
- Información del chofer
- Lista de otros choferes en servicio

**Decir:**
> "El chofer puede ver su estado actual, actualizar su ubicación GPS, y gestionar sus viajes. Está diseñado para uso en tiempo real mientras conduce."

**C) Pasajero Home**
```
Email: ana.pasajero@des.com
Password: demo123
```

**Mostrar:**
- Lista de viajes disponibles
- Información del chofer y vehículo
- Botón de reserva
- Precio por asiento

**Decir:**
> "El pasajero puede buscar viajes disponibles entre Perico y San Salvador de Jujuy, ver información del chofer, y hacer reservas fácilmente."

### 4. DEMOSTRAR MULTI-TENANT (2 minutos)

**Acción:** En Swagger, crear una segunda remisería
```
POST /api/remiserias
{
  "nombre": "Remises Jujuy Centro",
  "cuit": "30-87654321-0",
  "telefono": "388-7654321",
  "email": "info@jujuycentro.com"
}
```

**Mostrar:**
- Nueva remisería creada
- Los datos están segregados por tenant

**Decir:**
> "El sistema es multi-tenant, lo que significa que cada remisería tiene sus propios choferes, autos y viajes completamente independientes."

### 5. MOSTRAR REAL-TIME (2 minutos)

**Acción:** Abrir consola del navegador (F12) y mostrar WebSocket
```javascript
const socket = io('http://localhost:3000/des');
socket.on('viaje_actualizado', (data) => {
  console.log('Viaje actualizado:', data);
});
```

**Mostrar:**
- Conexión WebSocket activa
- Eventos en tiempo real

**Decir:**
> "Tenemos comunicación en tiempo real con Socket.io. Cuando un chofer actualiza su ubicación o estado, los pasajeros lo ven inmediatamente en su app."

### 6. MOSTRAR BASE DE DATOS (1 minuto)

**Acción:** Abrir pgAdmin o mostrar query
```sql
SELECT r.nombre, COUNT(c.idChofer) as choferes
FROM remiserias r
LEFT JOIN choferes c ON r.idRemiseria = c.idRemiseria
GROUP BY r.idRemiseria, r.nombre;
```

**Mostrar:**
- Datos reales en PostgreSQL
- Relaciones correctas

**Decir:**
> "Usamos PostgreSQL con TypeORM para persistencia robusta. Los datos están correctamente relacionados con foreign keys y constraints."

### 7. CIERRE (1 minuto)

**Decir:**
> "DES es una solución completa que puede escalar a múltiples remiserías. El MVP incluye autenticación, multi-tenant, GPS tracking, y una app móvil funcional. Próximos pasos incluyen el sistema completo de paquetes, pagos con MercadoPago, y notificaciones push."

## 🎯 PUNTOS CLAVE PARA ENFATIZAR

### Técnicos
- ✅ **Multi-tenant**: Cada remisería es un tenant independiente
- ✅ **Real-time**: Socket.io para actualizaciones instantáneas
- ✅ **GPS**: Tracking de choferes en tiempo real
- ✅ **Mobile**: App nativa, no web-view
- ✅ **Seguridad**: JWT + bcrypt para passwords
- ✅ **Documentación**: Swagger auto-generado

### Negocio
- ✅ **Escalable**: Diseñado para múltiples remiserías
- ✅ **Local**: Enfocado en Jujuy (Perico ↔ San Salvador)
- ✅ **Completo**: Viajes + Paquetes + Tracking
- ✅ **Tiempo real**: Monitoreo de choferes
- ✅ **Móvil**: App para pasajeros y choferes

## 🐛 Posibles Problemas y Soluciones

### Backend no inicia
**Solución:** Mostrar logs en terminal
```bash
cd backend
npm run start:dev
```

### Mobile no conecta
**Solución:** Verificar IP correcta
- Android emulator: `10.0.2.2`
- iOS simulator: `localhost`
- Physical device: IP local de la PC

### Error de base de datos
**Solución:** Verificar PostgreSQL
```bash
pg_isready
psql -U postgres -c "CREATE DATABASE des_db;"
```

## 📱 Demo en Vivo (si hay tiempo)

### Crear un viaje en vivo
```
POST /api/viajes
{
  "origen": "Perico",
  "destino": "San Salvador de Jujuy",
  "fechaSalida": "2024-11-10",
  "horaSalida": "15:00:00",
  "tarifaPorAsiento": 800,
  "asientosDisponibles": 4,
  "idChofer": 1,
  "idAuto": 1
}
```

### Mostrar actualización en tiempo real
1. Actualizar estado chofer en Swagger
2. Ver reflejado en mobile inmediatamente

## 🎬 Cierre de Demo

**Decir:**
> "Esta es una demo funcional que demuestra la viabilidad del proyecto. La arquitectura está diseñada para escalar y agregar funcionalidades adicionales. ¿Preguntas?"

## 📋 Checklist Post-Demo

- [ ] Mostrar código fuente si hay preguntas técnicas
- [ ] Explicar arquitectura multi-tenant
- [ ] Mostrar plan de desarrollo futuro
- [ ] Compartir repositorio y documentación
- [ ] Recolectar feedback

## 🎯 Métricas a Mostrar

- **Tiempo de respuesta API**: < 100ms
- **Tiempo de carga mobile**: < 3 segundos
- **Concurrent users**: Soporta múltiples conexiones
- **Database**: PostgreSQL con índices optimizados

---

**Duración total estimada:** 10-15 minutos
**Objetivo:** Demostrar viabilidad técnica y potencial de negocio