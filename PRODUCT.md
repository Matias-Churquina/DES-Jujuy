# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tres roles con el mismo nivel de servicio (confirmado: los 3 roles por igual):

- **Pasajeros**: personas de San Salvador de Jujuy, Perico y localidades cercanas que reservan viajes interurbanos con anticipación, pagan (efectivo o MercadoPago), siguen al chofer en el mapa en tiempo real y envían paquetes con tracking público.
- **Choferes**: conductores de remiserías que gestionan sus viajes (crear/iniciar/finalizar), ven reservas y ocupación por asiento, cobran, actualizan estados de paquetes con GPS y chatean con pasajeros.
- **Supervisores/Admin de remisería**: operan la flota — gestionan choferes, destinos, viajes, reciben y asignan paquetes, monitorean la operación en vivo.

Contexto: competencia/hackathon — la demo se evalúa como producto completo.

## Product Purpose

DES (Destino Express Service) conecta pasajeros con remiserías de Jujuy: reservas de viajes con asientos y pago online, seguimiento GPS del chofer en vivo, chat pasajero↔chofer, y envío de paquetes con ticket/código de seguimiento público y trazabilidad de punta a punta. Éxito = un pasajero reserva, paga y sigue su viaje; un paquete se rastrea sin login; la remisería opera todo desde un panel.

## Positioning

Dos mecanismos que un remis o Uber común no puede copiar con honestidad (confirmado):

- **Multi-remisería**: una plataforma que conecta varias remiserías como tenants — cada una con sus choferes, autos y operación propia.
- **Paquetería + tracking**: envío de paquetes con código de seguimiento público (`DES-XXXX`), trazabilidad con GPS y recepción física verificada antes de asignar chofer.

## Operating Context

- Zona: San Salvador de Jujuy, Perico y localidades de Jujuy (catálogo administrable con coordenadas).
- El cliente deja el paquete en la remisería y recibe un ticket; lo sigue desde la web pública `/track` sin login.
- El supervisor marca el paquete como recibido físicamente ANTES de poder asignarlo a un chofer (regla logística central).
- Pagos: MercadoPago (Checkout Pro + webhook) y efectivo cobrado por el chofer.
- Modo oscuro/claro; mapa con tracking en vivo vía WebSocket.

## Capabilities and Constraints

- Mobile-first (confirmado): los pasajeros usan celular principalmente; el diseño prioriza pantallas chicas sin degradar desktop.
- Roles: ADMIN, CHOFER, PASAJERO con menús propios.
- Stack existente: React 18 + TS + Vite + Tailwind v3 + React Router + Axios + socket.io-client + Leaflet; backend NestJS + PostgreSQL. El diseño actual está portado del Figma Make oficial del proyecto.
- Reglas de negocio: anti-sobreventa con lock transaccional; transiciones de estado validadas en viajes/reservas/paquetes.
- Terminología del dominio: reserva, viaje, remisería, paquete, trazabilidad, ticket/código de seguimiento.

## Brand Commitments

- Nombre: **DES — Destino Express Service**. Logo: cuadrado redondeado con gradiente violeta e inicial "D".
- Voz (confirmado): **mixta** — rioplatense informal en saludos y CTAs ("¿A dónde vamos?", "reservá"), español neutro en textos técnicos y mensajes de sistema.
- Identidad visual de referencia: el diseño oficial generado en Figma Make (violeta #6366f1, Inter, light/dark).

## Evidence on Hand

- Datos demo reales: 8 localidades de Jujuy con coordenadas, choferes/pasajeros/viajes seed.
- Mapa real con Leaflet + OSM; rutas por OSRM; tracking GPS real del chofer vía browser geolocation.
- MercadoPago real en sandbox ya probado end-to-end.
- Diseño de referencia: Figma Make `88mfOcw0eYwQYl8N9bR4nQ` (fuente CSS completa ya integrada en `web/src/styles/figma.css`).
- No fabricar: testimonios, estadísticas de uso, precios de mercado ni claims de adopción.

## Product Principles

1. **Mobile-first siempre**: toda pantalla se diseña primero para el celular del pasajero.
2. **Un ticket basta**: el código de seguimiento público es la credencial — nunca pedir login para rastrear.
3. **Tres roles, una sola calidad**: el nivel de craft es idéntico en pasajero, chofer y supervisor.
4. **Verdad logística sobre teatro**: los estados reflejan la operación real (recibido físico antes de asignar, GPS real del chofer).
5. **La identidad del Figma manda**: refinar sobre el sistema violeta/Inter existente, no reemplazarlo sin pedido explícito.
