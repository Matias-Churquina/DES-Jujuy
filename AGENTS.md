# DES - Destino Express Service

## Estado Actual del Proyecto

### ✅ Completado (Fase Demo)

#### Backend (NestJS)
- ✅ Estructura monorepo con backend y mobile
- ✅ TypeORM con PostgreSQL
- ✅ Entidades completas (11 entidades)
- ✅ Módulo Auth con JWT
- ✅ Módulo Users
- ✅ Módulo Remiserias (multi-tenant)
- ✅ Módulo Choferes
- ✅ Módulo Viajes
- ✅ WebSocket Gateway básico
- ✅ Seed de datos demo
- ✅ Swagger documentation
- ✅ Docker Compose

#### Mobile (React Native)
- ✅ React Native CLI (sin Expo)
- ✅ Redux Toolkit + RTK Query
- ✅ React Navigation (Stack)
- ✅ Pantalla Login funcional
- ✅ Pantalla Pasajero (lista viajes)
- ✅ Pantalla Chofer (estado)
- ✅ Pantalla Admin (estadísticas)
- ✅ Store Redux configurado
- ✅ API services integrados

#### Documentación
- ✅ README general
- ✅ API.md (endpoints)
- ✅ ARQUITECTURA.md (diagramas)
- ✅ INSTALACION-DEMO.md (guía rápida)
- ✅ AGENTS.md (este archivo)

#### Scripts
- ✅ start-demo.bat (backend)
- ✅ start-mobile.bat (mobile)
- ✅ docker-compose.yml
- ✅ GitHub Actions workflows

## 🎯 Alcance de la Demo Actual

### Funcionalidades Implementadas
1. **Autenticación**
   - Login con JWT
   - 3 roles: Admin, Chofer, Pasajero
   - Usuarios demo pre-cargados

2. **Multi-tenant**
   - Remiserías como tenants
   - Datos segregados por remisería

3. **Backend API**
   - CRUD básico de todas las entidades
   - WebSocket para real-time
   - Validación de inputs
   - Documentación Swagger

4. **Mobile App**
   - Login funcional
   - Navegación por rol
   - Pantallas básicas para cada rol
   - Integración con backend

## 🚧 Pendiente para MVP Completo

### Backend
- [ ] Módulo Pasajeros (CRUD completo)
- [ ] Módulo Autos (gestión completa)
- [ ] Módulo Reservas (lógica de negocio)
- [ ] Módulo Paquetes (sistema completo)
- [ ] Módulo Trazabilidad (tracking)
- [ ] Módulo Ubicación (GPS avanzado)
- [ ] Módulo Pagos (MercadoPago)
- [ ] Módulo Notificaciones (FCM)
- [ ] Guards avanzados (@Roles, @Remiseria)
- [ ] DTOs de validación completos
- [ ] Tests unitarios
- [ ] Migrations de DB
- [ ] Rate limiting
- [ ] Logging estructurado

### Mobile
- [ ] Mapa personalizado Uber-style
- [ ] GPS tracking real-time
- [ ] Notificaciones push
- [ ] Offline support
- [ ] Animaciones Reanimated
- [ ] Design system completo
- [ ] Tests (Detox)
- [ ] Performance optimization
- [ ] Dark mode

### Infraestructura
- [ ] CI/CD completo
- [ ] Monitoring (Sentry)
- [ ] Analytics
- [ ] Backup automático
- [ ] Load balancing

## 📁 Estructura del Repositorio

```
DES/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/         # Módulos (auth, users, remiserias, etc.)
│   │   ├── common/          # Guards, DTOs, pipes
│   │   ├── config/          # Configuración
│   │   ├── database/        # TypeORM config
│   │   │   ├── data-source.ts
│   │   │   └── seeds/
│   │   │       └── demo.seed.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── seed.ts
│   ├── test/               # Tests
│   ├── docker/              # Dockerfiles
│   ├── docs/                # Documentación
│   ├── .env                 # Variables de entorno
│   ├── .env.example        # Ejemplo de env
│   ├── package.json        # Dependencias backend
│   ├── tsconfig.json       # TypeScript config
│   └── README.md           # Guía backend
│
├── mobile/                  # React Native Mobile
│   ├── src/
│   │   ├── api/             # RTK Query API
│   │   │   └── apiSlice.ts
│   │   ├── components/      # Componentes reutilizables
│   │   ├── screens/         # Pantallas
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── types.ts
│   │   │   ├── pasajero/
│   │   │   │   └── PasajeroHomeScreen.tsx
│   │   │   ├── chofer/
│   │   │   │   └── ChoferHomeScreen.tsx
│   │   │   └── admin/
│   │   │       └── AdminHomeScreen.tsx
│   │   ├── store/           # Redux store
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       └── authSlice.ts
│   │   ├── navigation/      # Navegación
│   │   │   └── RootNavigator.tsx
│   │   ├── utils/           # Utilidades
│   │   ├── hooks/           # Custom hooks
│   │   ├── theme/           # Design system
│   │   ├── services/        # Servicios (Socket, FCM)
│   │   ├── index.js
│   │   └── App.tsx
│   ├── android/             # Android nativo
│   ├── ios/                 # iOS nativo
│   ├── assets/              # Imágenes, iconos
│   ├── app.json            # Configuración app
│   ├── index.js            # Entry point
│   ├── package.json        # Dependencias mobile
│   ├── tsconfig.json       # TypeScript config
│   ├── metro.config.js     # Metro bundler config
│   └── babel.config.js     # Babel config
│
├── docs/                    # Documentación del proyecto
│   ├── API.md              # Endpoints
│   └── ARQUITECTURA.md     # Diagramas
│
├── .github/workflows/       # CI/CD
│   ├── backend.yml
│   └── mobile.yml
│
├── .gitignore              # Git ignore
├── docker-compose.yml      # Docker services
├── INSTALACION-DEMO.md     # Guía rápida
├── README.md               # README general
├── start-demo.bat          # Script backend
└── start-mobile.bat        # Script mobile
```

## 🚀 Cómo Ejecutar la Demo

### Opción 1: Scripts Automatizados (Recomendado)

```powershell
# Verificar requisitos
.\check-demo.cmd      # Para PowerShell/CMD
.\check-demo.ps1      # Para PowerShell moderno

# Iniciar backend automáticamente
.\start-demo.cmd      # Para PowerShell/CMD
.\start-demo.ps1      # Para PowerShell moderno

# Iniciar mobile automáticamente
.\start-mobile.cmd    # Para PowerShell/CMD
.\start-mobile.ps1    # Para PowerShell moderno
```

**NOTA:** En PowerShell usa `.\` antes del nombre del archivo:
- ✅ `.\check-demo.cmd`
- ✅ `.\start-demo.ps1`
- ❌ `check-demo.cmd` (sin `.\` no funciona)

### Opción 2: Manual

#### Backend
```bash
cd backend
npm install
npm run seed
npm run start:dev
```

#### Mobile (Android)
```bash
cd mobile
npm install
npm run android
```

#### Mobile (iOS)
```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

### Opción 3: Docker (si está instalado)
```bash
cd DES
docker-compose up
```
```bash
cd DES
docker-compose up
```

### Opción 2: Manual

#### Backend
```bash
cd backend
npm install
npm run seed
npm run start:dev
```

#### Mobile (Android)
```bash
cd mobile
npm install
npm run android
```

#### Mobile (iOS)
```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

## 🧪 Usuarios Demo

| Rol | Email | Password | Descripción |
|-----|-------|----------|-------------|
| Admin | admin@des.com | demo123 | Administrador de remisería |
| Chofer | carlos.chofer@des.com | demo123 | Chofer 1 |
| Chofer | miguel.chofer@des.com | demo123 | Chofer 2 |
| Pasajero | ana.pasajero@des.com | demo123 | Pasajera 1 |
| Pasajero | luis.pasajero@des.com | demo123 | Pasajero 2 |

## 📊 Datos Demo Incluidos

- **Remisería**: "Remises Demo Jujuy"
- **Choferes**: 2 con GPS y autos asignados
- **Pasajeros**: 2 registrados
- **Autos**: 2 (Toyota Corolla, Ford Focus)
- **Viajes**: 2 programados (Perico ↔ San Salvador)

## 🔌 API Endpoints Principales

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/choferes` - Listar choferes
- `PATCH /api/choferes/:id/estado` - Cambiar estado
- `PATCH /api/choferes/:id/ubicacion` - Actualizar GPS
- `GET /api/viajes/disponibles` - Buscar viajes
- `POST /api/viajes` - Crear viaje

## 🎯 Próximos Pasos (Semana 1-2)

1. **Completar backend faltante**
   - Módulo Pasajeros completo
   - Módulo Reservas
   - Módulo Paquetes
   - Guards y DTOs avanzados

2. **Mejorar mobile**
   - Mapa personalizado
   - GPS real-time
   - UI/UX profesional
   - Notificaciones

3. **Tests**
   - Backend unit tests
   - Mobile e2e tests

4. **Documentación**
   - API completa con ejemplos
   - Guía de desarrollo

## 📝 Notas Importantes

- Esta es una **DEMO** funcional, no producción
- Datos de prueba incluidos
- MercadoPago y Firebase en modo demo
- GPS requiere permisos en mobile
- WebSocket básico implementado
- Falta optimización de performance

## 🐛 Issues Conocidos

- [ ] En Android emulator, usar `10.0.2.2` en lugar de `localhost`
- [ ] Falta manejo de errores en mobile
- [ ] Falta offline support
- [ ] Falta loading states en algunas pantallas

## 🔧 Diagnóstico Backend (completado 2024-11-06)

### Bugs encontrados y corregidos
1. **Enums con strings** → corregido a `ChoferEstado.DISPONIBLE`, `PasajeroEstado.ACTIVO`, `AdminEstado.ACTIVO` en auth.service.ts
2. **Relación faltante** → agregado `@ManyToOne` en `trazabilidad-paquete.entity.ts`
3. **CUIT largo** → cambiado a `'30123456789'` (sin guiones) en seed
4. **passwordHash doble hasheado** → FIX CRÍTICO: `@BeforeUpdate` re-hasheaba en cada update. Ahora solo hashea si el valor NO empieza con `$2` (verificar en `usuario.entity.ts`)
5. **Seed sin adminRepository** → agregado `@InjectRepository(Admin)` en demo.seed.ts
6. **Perfil admin no se creaba** en update path → corregido, ahora crea perfil si falta
7. **SALT_ROUNDS filtrado** en respuesta → corregido con `delete rest.SALT_ROUNDS` en usuarioToJSON
8. **POST /login devolvía 201** → corregido con `@HttpCode(200)`
9. **Fecha en seed** → `fechaSalida` usa `new Date(fecha)` porque entity espera `Date`, no string
10. **Seed con upsert** → ahora verifica existencia por cuit/email/patente y actualiza en vez de duplicar

### Estado verificado en BD
- ✅ 5 usuarios creados (admin, 2 choferes, 2 pasajeros) — todos `activo=true`
- ✅ password_hash formato bcrypt correcto (`$2b$10$...`, 60 chars)
- ✅ Choferes tienen perfil + licencia + calificación
- ✅ Pasajeros tienen perfil
- ✅ Login POST `/api/auth/login` funciona con `admin@des.com`/`demo123` → devuelve JWT
- ✅ Swagger en `http://localhost:3000/api/docs`

### Estado verificado (fin de sesión)
- ✅ Login funciona con `admin@des.com`/`demo123` → devuelve JWT (200)
- ✅ Endpoints responden correctamente (confirmado por el usuario)
- ✅ mobile/tsconfig.json corregido: quitado `baseUrl` deprecado, paths con `./src/*`
- ⚠️ mobile aún no instaló dependencias (`@react-native/typescript-config` no encontrado hasta `npm install`)

### Cambio de alcance (competencia)
- **Objetivo nuevo:** app web responsive profesional EN PRODUCCIÓN para competencia (mobile pasa a fase 2)
- **Frontend web** (`web/`): Vite + React 18 + TS + Tailwind + React Router + Axios — FUNCIONANDO
- **Diseño UI:** generado en Figma Make (link: https://www.figma.com/make/88mfOcw0eYwQYl8N9bR4nQ) — minimalista, claro/oscuro, estilo Uber. Referencia para re-implementar pantallas
- **Fix clave frontend:** eliminar `vite.config.js` viejo (tapaba `vite.config.ts` con alias @) — si vuelve a fallar import `@/`, revisar que no haya config duplicado
- **Vistas implementadas:** Login, Admin (Dashboard/Choferes/Viajes/Remiserías), Chofer (Dashboard/Viajes), Pasajero (BuscarViajes/MisReservas placeholder)

### Módulo Reservas — COMPLETADO (end-to-end)
- Backend: `reservas.controller.ts` + `reservas.service.ts` con transacciones + `pessimistic_write` lock (anti-sobreventa)
- Endpoints: `POST /reservas`, `PATCH /reservas/:id/cancelar`, `PATCH /reservas/:id/pago-efectivo`, `GET /reservas/pasajero/:id`, `GET /reservas/viaje/:id`
- Asientos se descuentan al reservar, se devuelven al cancelar, viaje pasa a COMPLETO cuando llega a 0
- Eventos WS: `reserva_creada_viaje_X`, `asientos_actualizados_viaje_X`, `reserva_cancelada_X`, `pago_confirmado_reserva_X`
- Frontend: `BuscarViajes` reserva real (Efectivo/MercadoPago), `MisReservas` lista activas + historial + cancelar

### Bug crítico reservas — CORREGIDO (2026-11-07)
- **Error:** `POST /reservas` → 500 `FOR UPDATE no puede ser aplicado al lado nulable de un outer join`
- **Causa:** `findOne` con `relations` + `lock: pessimistic_write` genera `FOR UPDATE` sobre LEFT JOINs → Postgres lo rechaza
- **Fix:** quitar `relations` de las queries con lock en `reservas.service.ts` (create y cancelar). El lock queda solo sobre la tabla raíz.
- **REGLA:** NUNCA combinar `relations` con `pessimistic_write` en TypeORM+Postgres. Si hace falta lock + datos relacionados, usar dos queries separadas.

### Verificación end-to-end reservas (curl, 2026-11-07) ✅
- POST /reservas → 201, reserva CONFIRMADA, asientos 4→3
- Duplicada mismo pasajero+viaje → 409
- 5 asientos cuando hay 3 → 400
- GET /reservas/pasajero/:id → lista con viaje
- PATCH /:id/cancelar → CANCELADA, asientos 3→4 restaurados
- Doble cancelación → 400
- Frontend: warnings React Router v7 corregidos (future flags en main.tsx), favicon 404 corregido (SVG inline en index.html)

### Catálogo Destinos + Viajes normalizados (2026-11-07)
- Nueva entidad `Destino` (idDestino, nombre único, latitud, longitud, activo) — módulo `destinos` con CRUD completo
- `Viaje` migrado: `origen`/`destino` string → FKs `idOrigen`/`idDestino` → Destino. Columnas `origenCoordenadas`/`destinoCoordenadas` eliminadas (coords viven en Destino)
- `GET /destinos` (público, ?todos=true para admin), POST/PATCH/DELETE con JWT
- `GET /viajes/disponibles?origen=ID&destino=ID` (ahora por IDs, no strings)
- `POST /viajes` con `CreateViajeDto` validado (auto existe, capacidad, fecha no pasada, origen≠destino)
- `PATCH /viajes/:id/estado` valida transiciones: ABIERTO→EN_CURSO/CANCELADO, EN_CURSO→FINALIZADO/CANCELADO, COMPLETO→EN_CURSO/CANCELADO
- Seed: 8 localidades Jujuy con coords + fechas dinámicas (mañana/pasado mañana)
- **LECCIÓN:** synchronize falló al agregar `idOrigen NOT NULL` con filas existentes → borrar viajes demo antes de migrar (solo dev)
- Frontend: BuscarViajes con datalist buscable de destinos, Admin→Destinos CRUD, Chofer→Mis Viajes con crear viaje + iniciar/finalizar/cancelar + reservas + botón Cobrar efectivo
- Verificado E2E por API: crear viaje, transiciones, reserva 2 asientos $1600, pago-efectivo PAGADO

### Fase 3 — Mapa + Tracking en vivo (2026-11-07)
- Frontend: `leaflet@1.9.4` + `react-leaflet@4.2.1` + `@types/leaflet` instalados
- `web/src/components/Mapa.tsx` — MapContainer + TileLayer Carto `voyager` (estilo limpio), markers con `divIcon` emoji (evita bug de íconos en bundlers), fitBounds automático, polyline de ruta
- `web/src/lib/osrm.ts` — ruta + ETA gratis vía `router.project-osrm.org` (sin key)
- `web/src/lib/socket.ts` — singleton socket.io-client → `http://localhost:3000/des`
- `web/src/pages/pasajero/MiViaje.tsx` — mapa con origen/destino/chofer EN VIVO, ETA, datos chofer, estado reserva/pago. Ruta `/pasajero/viaje`
- `web/src/pages/chofer/Dashboard.tsx` — `geolocation.watchPosition` cuando viaje EN_CURSO → PATCH `/choferes/:id/ubicacion` cada 10s (throttle) + mapa del viaje actual
- Backend: `choferes.service.updateUbicacion` ahora broadcast `ubicacion_chofer` a sala `viaje_X` si hay viaje EN_CURSO (WebsocketModule importado en ChoferesModule)
- **FIX gateway:** `JwtAuthGuard` (HTTP) rompía joins WS → removido del handler `join` (TODO: guard WS con token en handshake.auth)
- **FIX UX:** datalist nativo filtraba por texto actual (solo mostraba lo seleccionado) → reemplazado por `DestinoSelect` combobox propio (siempre lista completa + filtro + excluye campo opuesto)
- Verificado E2E: cliente WS unido a `viaje_3` recibió `ubicacion_chofer` real tras PATCH

### Fase 5 — MercadoPago (2026-11-07)
- SDK actualizado a `mercadopago@2.9.0` (v1.5 usaba API deprecada)
- `PagosModule`: `POST /pagos/preferencia/:idReserva` (JWT) crea preferencia Checkout Pro → devuelve `{initPoint}`; `POST /pagos/webhook` (público, 200 inmediato + procesa async)
- Webhook: acepta formato nuevo `{type:'payment',data:{id}}` y legacy `?topic=payment&id=`; consulta el pago a la API de MP (anti-forging), si `approved` → reserva PAGADO + codigoPagoMercadoPago + emit WS a `reserva_X` y `viaje_X`
- Frontend: botón "MercadoPago" en BuscarViajes → crea reserva canal LINK → `window.location = initPoint` → checkout MP → back_urls a `/pasajero/reservas?pago=ok|error|pendiente`
- `.env`: `MERCADOPAGO_WEBHOOK_URL=https://zodiac-stargazer-rascal.ngrok-free.dev/api/pagos/webhook`, `FRONTEND_URL=http://localhost:5173` — FALTAN tokens TEST reales
- MP panel: app "DES-App-Checkout-Pro" creada (Preferences), webhook configurado evento "Pagos (legacy)"
- Verificado: webhook responde 200 por ngrok; preferencia sin token real → pendiente de credenciales
- FIX mapa: tiles `rastertiles/voyager` piden key → cambiado a `light_all`/`dark_all` (gratis sin key)
- Pendiente MP: signature validation (x-signature), retry, credenciales prod, SDK preferencia test E2E

### Fase 4 — Paquetería + Toast (2026-11-07)
- Backend `PaquetesModule`: `POST /paquetes` (crea envío + código `DES-XXXXXXXX` + 1er trazabilidad), `GET /paquetes/track/:codigo` **PÚBLICO** (el ticket es la credencial), `GET /paquetes/pasajero/:id|chofer/:id` (JWT), `GET /paquetes` (admin, ?idRemiseria), `PATCH /:id/asignar`, `PATCH /:id/estado` (con GPS)
- Estados: PENDIENTE_RECOGIDA→ASIGNADO→EN_TRANSITO→ENTREGADO (+INCIDENCIA/DEVUELTO/CANCELADO) con transiciones validadas
- `TrazabilidadPaquete.latitud/longitud` ahora nullable (eventos sin GPS)
- WS: sala `paquete_{codigo}` → página pública de tracking se actualiza en vivo
- Frontend: `/track` y `/track/:codigo` **públicos** (sin login) con timeline + mapa; Pasajero→Paquetería (crear + mis envíos + copiar ticket); Chofer→Paquetería (retirar/entregar/incidencia con GPS auto); Admin→Centro de Paquetería (filtros por estado + asignar chofer)
- Toast global: `ToastProvider` + `useToast()` reemplazó todos los alert()/banners sueltos (BuscarViajes, MisReservas, chofer, admin, Login)
- Verificado E2E: crear paquete → track público 1 evento → asignar chofer → 2 eventos
- MercadoPago: pago E2E verificado por el usuario (reserva → PAGADO)
- FIX proceso fantasma: al matar `start:dev` quedan hijos vivos en :3000 → `netstat -ano | grep :3000 | taskkill /F /PID` antes de reiniciar

### Próxima sesión — retomar desde aquí
1. Verificar flujo reservas en navegador (ya probado por API — falta UI end-to-end)
2. Luego: módulo Paquetes, mapa con tracking en tiempo real, chat pasajero-chofer, MercadoPago
3. Replicar diseño Figma en componentes (modo oscuro, mapa tipo Uber, asientos visuales)
4. Deploy producción: backend (Render/Railway), web (Vercel/Netlify), PostgreSQL (Neon/Supabase)
5. Plan maestro y checklist completo en `PLAN-DESARROLLO.md`
1. Verificar `GET /api/choferes`, `GET /api/viajes`, `GET /api/remiserias` en Swagger
2. Probar `PATCH /api/choferes/1/ubicacion` con GPS `{latitud, longitud}`
3. Probar WebSocket en consola navegador: `io('http://localhost:3000/des')`
4. Instalar mobile: `cd mobile && npm install` (resuelve error tsconfig)
5. Decidir demo mobile: Android emulator vs React Native Web (`npx expo start --web`)
6. Pendientes MVP: módulos Reservas, Paquetes, Ubicación, Pagos (MercadoPago), FCM

### Comandos clave para retomar
```powershell
cd backend && npm run start:dev   # Backend → http://localhost:3000/api/docs
npm run seed                      # Actualizar datos demo
cd mobile && npm install          # Instalar mobile
```

## 🔧 Comandos Útiles

```bash
# Backend
npm run start:dev      # Desarrollo
npm run build          # Build producción
npm run test           # Tests
npm run seed           # Ejecutar seed
npm run typeorm        # TypeORM CLI

# Mobile
npm run android        # Android
npm run ios            # iOS
npm run start          # Metro bundler
npm test               # Tests

# Docker
docker-compose up      # Levantar servicios
docker-compose down    # Bajar servicios
```

## 📞 Contacto

Para dudas o problemas con el proyecto, revisar:
- `INSTALACION-DEMO.md` - Guía de instalación
- `backend/README.md` - Documentación backend
- `docs/API.md` - Referencia de API

---

**Última actualización:** 2024-11-06
**Versión:** 1.0.0-DEMO
### Fase — Chat pasajero↔chofer (2026-11-08)
- `ChatModule` backend: entidad `mensajes` (idReserva, idEmisor, idReceptor, texto, leido, createdAt)
- Endpoints (JWT): `GET /chat/reserva/:id`, `POST /chat/reserva/:id` {texto}, `PATCH /chat/reserva/:id/leer`, `GET /chat/reserva/:id/no-leidos`
- Solo participantes (pasajero o chofer de la reserva) pueden leer/enviar → ajeno = 403. Reserva CANCELADA = no chat.
- WS: sala `reserva_X` (join ya existía en gateway) — evento `mensaje_nuevo` broadcast a ambos
- Frontend: `components/ChatWidget.tsx` (modal estilo WhatsApp, burbujas, ticks de leído, auto-scroll, join/leave WS). Integrado en `MisReservas` (botón "💬 Chat con chofer") y `chofer/Viajes` (botón 💬 por reserva)
- Verificado E2E: Ana→Carlos 201, Luis ajeno 403, Carlos lee+responde, no-leídos 1→0 tras /leer

### Fase 6 (parcial) — Modo oscuro (2026-11-08)
- Tailwind `darkMode: 'class'`; `src/lib/theme.ts` (getTheme/applyTheme/toggleTheme/initTheme) — persistido en localStorage `des_theme`, `initTheme()` en main.tsx evita flash
- Toggle 🌙/☀️ en AppLayout (sidebar, abajo)
- Todos los componentes/páginas con variantes `dark:` (ui.tsx reescrito + script masivo sobre pages)
- Mapa: tiles CARTO `dark_all` en modo oscuro (re-render via evento `des-theme`)
- Build tsc+vite limpio
- Pendiente Fase 6: replicar pantallas exactas del Figma Make (link requiere auth, MCP figma-remote no responde)

### Fase 6 — Diseño Figma real portado (2026-11-08)
- Figma Make expone el código fuente vía MCP figma-remote (`get_design_context` → `file://figma/make/source/...`)
- `src/styles/figma.css` = CSS COMPLETO del Figma (50KB, tokens light+dark via `[data-theme]`, todas las clases .card/.sidebar/.kpi/etc)
- theme.ts setea `data-theme` attr + clase `dark` (figma css + tailwind dark:)
- `src/components/Icon.tsx` — set de iconos SVG exactos del Figma
- AppLayout reescrito con markup Figma: sidebar (logo-mark, side-nav+active-pip, support-card, user-row), topbar (título+acciones, toggle tema, bell, avatar), bottom-nav móvil
- BuscarViajes → PassengerHome real: welcome+weather, search-card con DestinoSelect estilo input-box+location-dot, resultados trip-cards, destinos frecuentes, promo paquetes
- Chofer Dashboard → DriverDashboard: availability toggle, current-trip con mapa+SeatMap por reservas/estadoPago, earning-card, stats, weather
- Admin Dashboard → SupervisorDashboard: KPIs reales, fleet map con choferes GPS, activity feed real (reservas+paquetes)
- Mapa: tiles CARTO ahora piden API key → cambiado a OSM estándar + filtro CSS invert en dark
- NOTA: tras cambiar tailwind.config hay que REINICIAR `npm run dev` de Vite o los dark: no compilan
- Pendiente: portar resto de vistas Figma (ActiveTrip, Bookings, Packages, Management, Kanban)

### Impeccable critique + port Figma (2026-11-10)
- 3 skills instaladas: impeccable, frontend-design, web-design-guidelines (`.agents/skills/`)
- PRODUCT.md escrito (raíz) — platform web, mobile-first, 3 roles igual, diferenciadores multi-remisería+paquetería, voz mixta
- Critique dual-agent: score 25/40 — ver `.impeccable/critique/2026-11-10T13-54-06Z__web-src.md`
- Fixes aplicados:
  * MiViaje → trip-sheet Figma completo (eta-card, driver-profile+plate, timeline-dots, trip-meta, chat inline .chat/.message violeta)
  * MisReservas → booking-card (booking-date/route/driver/price/actions) + modal confirmación cancel
  * BuscarViajes → P0 fix: modal confirmación con total (asientos×tarifa) antes de MercadoPago
  * ChatWidget → clases .chat/.message violeta (era azul) sobre confirm-overlay
  * AppLayout → logout icon en topbar (antes solo sidebar, invisible en mobile), campana honesta (toast)
  * Admin Dashboard → poll 15s + timestamp (era "en vivo" falso), leyenda DESCANSO corregida
  * chofer/Paquetes → prompt() nativo → modal incidencia propio
  * bottom-nav → columnas flexibles (6 items admin no desbordan)
  * voseo: "tienes"→"tenés"
- Pendiente critique: kanban admin Paquetes, portar Login/Track/tablas admin a sistema Figma, socket real-time admin (hoy es poll 15s)
