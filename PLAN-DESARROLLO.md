# DES — Destino Express Service
## Plan Maestro de Desarrollo + Diagnóstico Completo

**Fecha:** 2026-11-07
**Rol:** Dirección de proyecto
**Objetivo:** App web responsive profesional, en producción, para competencia.
**Alcance actual:** Backend NestJS + Frontend Web (React) responsive. Mobile nativo postergado a Fase 2.

---

# PARTE 1 — PLAN DE MIGRACIÓN ORIGINAL (ARCHIVADO)

> Plan original: NestJS + React Native. Estado: **SUPERADO** — el alcance cambió a web responsive por decisión de producto (competencia). La carpeta `mobile/` queda presente pero NO se toca hasta Fase 2.

```
perico-remises-monorepo/          → RENOMBRADO a DES/
├── backend/   NestJS             → EN DESARROLLO ACTIVO
├── mobile/    React Native       → CONGELADO (Fase 2)
├── web/       React + Vite       → NUEVO: frontend principal
├── docs/
└── docker-compose.yml
```

---

# PARTE 2 — DIAGNÓSTICO COMPLETO (CHECKLIST)

Leyenda: ✅ Completo | 🟡 Parcial | ❌ Pendiente

## A. BACKEND (NestJS + TypeORM + PostgreSQL)

### Infraestructura
- ✅ Monorepo DES creado
- ✅ TypeORM conectado a PostgreSQL local
- ✅ ConfigModule con `.env`
- ✅ Docker Compose (Postgres + Redis + backend) — no probado aún
- ❌ Migrations (usamos `synchronize: true` — OK para dev, PROHIBIDO en producción)
- ❌ Helmet, rate limiting, CORS restringido
- ❌ Logging estructurado (Winston)
- ❌ Tests unitarios / e2e
- ❌ CI funcional (workflows creados, nunca ejecutados)

### Entidades (11 creadas)
- ✅ Usuario, Admin, Pasajero, Chofer, Remiseria
- ✅ Auto, TurnoChofer, Viaje, Reserva
- ✅ Paquete, TrazabilidadPaquete, Auditoria
- 🟡 Auditoria: entidad creada, SIN hooks/subscribers que la escriban (el proyecto viejo usaba hooks Sequelize — migrar a TypeORM subscribers)

### Módulos funcionales
- ✅ **Auth**: login/register JWT, JwtStrategy, perfiles auto-creados por rol
- ✅ **Users**: me, findAll, findOne
- ✅ **Remiserias**: CRUD básico (sin guards de tenant)
- ✅ **Choferes**: listado, detalle, cambiar estado, ubicación GPS, viajes
- ✅ **Viajes**: listado, detalle, crear, cambiar estado, disponibles, actualizar asientos
- ✅ **Reservas** (completo): crear con lock anti-sobreventa, cancelar con devolución de asientos, pago efectivo, eventos WS
- 🟡 **WebSocket**: gateway básico con rooms — eventos emitidos desde Reservas únicamente
- ❌ **Pasajeros** (módulo vacío — endpoints accesibles vía otras rutas)
- ❌ **Autos** (módulo vacío — choferes no pueden gestionar autos aún)
- ❌ **Paquetes** (entidad lista, sin lógica)
- ❌ **Trazabilidad** (entidad lista, sin lógica)
- ❌ **Ubicación/GPS avanzado** (solo PATCH manual)
- ❌ **Pagos MercadoPago** (dependencia instalada, sin implementar)
- ❌ **Notificaciones** (sin implementar)
- ❌ **Chat** pasajero↔chofer (no existe)

### Seguridad
- ✅ bcrypt con fix anti-doble-hash
- ✅ JWT + JwtAuthGuard
- 🟡 class-validator (solo en auth/reservas DTOs)
- ❌ RolesGuard (endpoints sin restricción por rol)
- ❌ RemiseriaGuard (aislamiento multi-tenant no forzado en queries)
- ❌ Rate limiting, sanitización, Helmet

## B. FRONTEND WEB (React + Vite + TS + Tailwind)

### Infraestructura
- ✅ Vite + React 18 + TypeScript
- ✅ Tailwind CSS + design tokens básicos
- ✅ Alias `@/` configurado (bug resuelto: vite.config.js conflictivo eliminado)
- ✅ Axios con interceptores JWT + 401 auto-logout
- ✅ Proxy `/api` y `/des` (ws) → localhost:3000
- ✅ React Router con ProtectedRoute por rol
- ✅ AuthContext con sesión persistente
- 🟡 Socket.io-client en package.json, sin usar aún
- ❌ Modo oscuro
- ❌ Testing
- ❌ PWA / offline

### Pantallas
- ✅ Login (con cuentas demo clickeables)
- ✅ AppLayout con sidebar por rol
- ✅ Admin: Dashboard (stats), Choferes (tabla), Viajes (tabla), Remiserías (cards)
- ✅ Chofer: Dashboard (estado toggle real, viaje actual, historial), Mis Viajes
- ✅ Pasajero: BuscarViajes (filtro + reserva Efectivo/MP), MisReservas (activas + historial + cancelar)
- ❌ Mapa en tiempo real (estilo Uber — pendiente, ver decisión mapas)
- ❌ Mi Viaje Activo (tracking + ETA + chat)
- ❌ Crear viaje (chofer)
- ❌ Gestión autos (chofer)
- ❌ Cobro QR / efectivo desde chofer
- ❌ Paquetería (las 3 vistas: pasajero/chofer/supervisor)
- ❌ Perfil de usuario
- ❌ Registro de usuarios desde UI
- ❌ Re-implementación visual según Figma Make

## C. DATOS DEMO
- ✅ Seed idempotente (upsert): 1 remisería, 1 admin, 2 choferes, 2 pasajeros, 2 autos, 2 viajes
- ❌ Seed de reservas/paquetes de ejemplo

## D. DEVOPS / PRODUCCIÓN
- ❌ Deploy backend (sugerido: Railway/Render)
- ❌ Deploy web (sugerido: Vercel/Netlify)
- ❌ PostgreSQL managed (sugerido: Neon/Supabase/Railway)
- ❌ Dominio + HTTPS
- ❌ Variables de entorno de producción
- ❌ Backups

---

# PARTE 3 — PLAN NUEVO: WEB APP RESPONSIVE

## Fases de trabajo (orden de ejecución)

### FASE 1 — Fundamentos de producción
- [ ] Guards: `@Roles()`, `@Public()`, RolesGuard global
- [ ] Global exception filter (respuestas de error consistentes)
- [ ] Helmet + rate limiting + CORS restringido por env
- [ ] `synchronize: false` + primera migration real
- [ ] Módulo Autos (chofer gestiona sus vehículos)
- [ ] Módulo Pasajeros (perfil, historial)

### FASE 2 — Viajes completos (core del negocio)
- [ ] Chofer: crear viaje desde UI (form + validaciones)
- [ ] Chofer: iniciar/finalizar/cancelar viaje con confirmaciones
- [ ] Chofer: agregar pasajero manual (ocupa asiento sin usuario)
- [ ] Chofer: ver reservas del viaje con estado de pago, cobrar efectivo
- [ ] Estados de reserva completos (UTILIZADA al finalizar viaje)
- [ ] WebSocket: suscripción frontend → actualización asientos en vivo

### FASE 3 — Mapa + Tracking en tiempo real ⭐
- [ ] Decisión mapas: **Leaflet + OpenStreetMap** (recomendado, ver abajo)
- [ ] Componente MapView con tiles custom (claro/oscuro)
- [ ] Chofer: enviar ubicación periódica (geolocation API del browser)
- [ ] WS: `ubicacion_chofer_viaje_X` broadcast
- [ ] Pasajero: "Mi Viaje Activo" — mapa con chofer moviéndose + ETA + ruta (OSRM)
- [ ] Marcadores custom (chofer, pasajero, origen, destino)

### FASE 4 — Paquetería
- [ ] Backend: PaquetesModule completo (crear, asignar chofer, estados)
- [ ] Backend: TrazabilidadModule (puntos GPS + cambios de estado)
- [ ] Pasajero: enviar paquete + código de seguimiento + timeline
- [ ] Chofer: paquetes asignados + actualizar estado con GPS auto
- [ ] Supervisor: kanban de paquetería + detalle

### FASE 5 — Pagos reales
- [ ] MercadoPago: crear preferencia → redirect/checkout → webhook
- [ ] Webhook confirma pago → actualiza reserva + notifica por WS
- [ ] QR de cobro para chofer (opcional fase posterior)

### FASE 6 — Chat + UX pulido
- [ ] Mensajes pasajero↔chofer (WebSocket + persistencia)
- [ ] Implementar diseño Figma: modo oscuro, asientos visuales, mapa estilo Uber
- [ ] Animaciones, skeletons, empty states, toasts
- [ ] Responsive mobile-first completo

### FASE 7 — Producción
- [ ] Deploy backend + DB managed + web
- [ ] Env de producción + secrets
- [ ] Smoke tests manuales completos por rol
- [ ] Video/presentación de la competencia

---

# PARTE 4 — DECISIÓN: MAPAS

## Recomendación: **OpenStreetMap + Leaflet + tiles personalizados**

| Opción | Costo | API Key | Personalización | Veredicto |
|--------|-------|---------|-----------------|-----------|
| **OSM + Leaflet + Carto tiles** | Gratis | No requiere | Total (tiles claro/oscuro) | ✅ ELEGIDA |
| Google Maps | Pago tras umbral | Requerida + tarjeta | Alta | ❌ Costo/complejidad |
| Mapbox | Gratis hasta 50k req/mes | Requerida | Muy alta | 🟡 Alternativa si OSM falla |

**Implementación:**
- Librería: `leaflet` + `react-leaflet`
- Tiles claro: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- Tiles oscuro: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Rutas/ETA: **OSRM público** `https://router.project-osrm.org` (gratis, sin key) — o self-hosted si escala
- Geocoding: Nominatim (OSM) con rate limit 1req/s — suficiente para MVP

**Lo que NECESITO de vos:** nada para mapas. Todo gratis.

---

# PARTE 5 — TAREAS DEL USUARIO: CREDENCIALES Y API KEYS

## 🔴 PRIORIDAD ALTA (para Fase 5 - Pagos)

### 1. MercadoPago
- [ ] Crear cuenta en https://www.mercadopago.com.ar/developers
- [ ] Ir a "Tus integraciones" → Crear aplicación
- [ ] Obtener **Access Token de prueba** (TEST-...) y **de producción**
- [ ] Obtener **Public Key**
- [ ] Para webhook: necesitás URL pública (ngrok en dev, dominio en prod)

Agregar a `backend/.env`:
```
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key
MERCADOPAGO_WEBHOOK_URL=https://tu-dominio.com/api/pagos/webhook
```

### 2. Base de datos producción (elegir uno)
- [ ] **Neon** (recomendado: https://neon.tech — Postgres gratis, generoso)
- [ ] Alternativa: Supabase / Railway / Render PostgreSQL
- [ ] Guardar: host, port, user, password, database, (sslmode=require)

### 3. Hosting backend
- [ ] **Railway** o **Render** (ambos tienen free tier para Node)
- [ ] Crear cuenta y conectar repo cuando corresponda

### 4. Hosting frontend
- [ ] **Vercel** (recomendado para Vite) o **Netlify**
- [ ] Crear cuenta, conectar repo

## 🟡 PRIORIDAD MEDIA (Fase 6+)

### 5. Google OAuth (login social — ya preparado en código)
- [ ] Google Cloud Console → proyecto → OAuth consent → credenciales Web
- [ ] Client ID + Client Secret + redirect URIs
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://tu-dominio.com/api/auth/google/callback
```

### 6. ngrok (para probar webhooks en desarrollo)
- [ ] Cuenta gratis en https://ngrok.com → authtoken
- [ ] `ngrok http 3000` cuando probemos pagos

## 🟢 OPCIONAL / FUTURO
- Firebase Cloud Messaging (push notifications — solo si hacemos app nativa)
- Sentry (monitoreo de errores)
- Dominio propio (nic.ar o similar)

## ⚠️ NUNCA commitear
- `.env` ya está en `.gitignore` — verificar antes de cada commit
- Los tokens de producción van SOLO en el panel de secretos del hosting

---

# PARTE 6 — ESTIMACIÓN DE ESFUERZO

No puedo prometer fechas exactas — depende de tu disponibilidad, credenciales y feedback. Pero como referencia de esfuerzo por módulo (trabajo continuo mío + tu validación):

| Fase | Contenido | Esfuerzo estimado |
|------|-----------|-------------------|
| 1 | Seguridad + guards + autos/pasajeros | 1 sesión intensa |
| 2 | Viajes completos (crear/iniciar/cobrar) | 1-2 sesiones |
| 3 | Mapa + tracking real-time | 1-2 sesiones (es la parte más compleja) |
| 4 | Paquetería completa | 1-2 sesiones |
| 5 | MercadoPago real + webhook | 1 sesión (requiere tus credenciales) |
| 6 | Chat + UI Figma + modo oscuro | 2 sesiones |
| 7 | Deploy producción + smoke tests | 1 sesión |

**Camino crítico para la competencia:** Fases 2 → 3 → 5 → 6 → 7.
Si hay poco tiempo, la versión mínima vendible es: reservas funcionando + mapa con tracking + pago efectivo + UI linda.

---

# PARTE 7 — PRÓXIMO PASO INMEDIATO

Sugerencia de director: **Fase 3 (mapa)** tiene el mayor impacto visual para la competencia, pero **Fase 2 (viajes completos)** es lo que hace la app "funcional de verdad".

Propuesta: arrancar por **Fase 2** (crear/iniciar/cobrar viaje desde UI de chofer) para cerrar el loop de negocio completo, y después el mapa como pieza wow.

¿Confirmás el orden y tus tareas de credenciales? Yo arranco cuando digas.
