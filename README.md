# DES - Destino Express Service

Sistema de gestión de remises para San Salvador de Jujuy y alrededores.

## 🎯 Visión

Plataforma multi-tenant que permite a múltiples remiserías gestionar sus choferes, viajes, reservas y envíos de paquetes con tracking en tiempo real.

## 🚀 Demo Funcional

**Estado:** ✅ DEMO LISTA PARA PRESENTACIÓN

Este proyecto está en fase DEMO con funcionalidades básicas implementadas para presentación.

## 📦 Componentes

### Backend (NestJS)
- **Framework**: NestJS + TypeScript
- **Base de datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT
- **Real-time**: Socket.io
- **Documentación**: Swagger

### Mobile (React Native)
- **Framework**: React Native CLI
- **Estado**: Redux Toolkit + RTK Query
- **Navegación**: React Navigation
- **UI**: Componentes nativos

## 🏗️ Estructura

```
DES/
├── backend/          # NestJS API
├── mobile/           # React Native App
├── docs/             # Documentación
├── .github/          # CI/CD
└── Scripts .bat     # Scripts de inicio rápido
```

## ⚡ Instalación Rápida

### Opción 1: Docker (Recomendado)
```bash
cd DES
docker-compose up
```

### Opción 2: Manual
```bash
# Backend
cd backend
npm install
npm run seed
npm run start:dev

# Mobile (en otra terminal)
cd mobile
npm install
npm run android
```

### Opción 3: Scripts Automatizados
```powershell
# PowerShell/CMD (usar .cmd o .ps1)
.\check-demo.cmd    # Para PowerShell/CMD clásico
.\check-demo.ps1    # Para PowerShell moderno

# Iniciar backend
.\start-demo.cmd    # Para PowerShell/CMD clásico  
.\start-demo.ps1    # Para PowerShell moderno

# Iniciar mobile (otra terminal)
.\start-mobile.cmd  # Para PowerShell/CMD clásico
.\start-mobile.ps1  # Para PowerShell moderno

# CMD clásico (solo .bat funciona sin .)
check-demo.bat
start-demo.bat
start-mobile.bat
```

## 📚 Documentación

- **README.md** - Este archivo (visión general)
- **AGENTS.md** - Estado completo del proyecto
- **INSTALACION-DEMO.md** - Guía detallada
- **docs/API.md** - Referencia de endpoints
- **docs/ARQUITECTURA.md** - Diagramas técnicos
- **backend/README.md** - Documentación backend

## 🎯 Funcionalidades Demo

### ✅ Implementadas
- [x] Autenticación JWT
- [x] Multi-tenant (remiserías)
- [x] CRUD usuarios
- [x] CRUD choferes
- [x] CRUD viajes
- [x] WebSocket básico
- [x] Mobile app funcional
- [x] Datos demo incluidos

### 🚧 En Desarrollo
- [ ] Sistema de paquetes
- [ ] Trazabilidad en tiempo real
- [ ] Mapa personalizado
- [ ] Pagos MercadoPago
- [ ] Push notifications
- [ ] GPS tracking avanzado

## 🧪 Usuarios Demo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@des.com | demo123 |
| Chofer | carlos.chofer@des.com | demo123 |
| Pasajero | ana.pasajero@des.com | demo123 |

## 📱 URLs

- **Backend API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs
- **WebSocket**: http://localhost:3000/des

## 🛠️ Stack Tecnológico

### Backend
- NestJS 10
- TypeORM
- PostgreSQL
- Socket.io
- JWT
- Swagger

### Mobile
- React Native 0.72
- Redux Toolkit
- RTK Query
- React Navigation
- TypeScript

## 📝 Próximos Pasos

1. **Completar módulos backend** (Paquetes, Trazabilidad, Pagos)
2. **Mapa personalizado** (React Native Maps)
3. **GPS real-time** (react-native-geolocation)
4. **Push notifications** (Firebase)
5. **UI/UX profesional** (Uber-style)

## 🐛 Problemas Conocidos

- En Android emulator: usar `10.0.2.2` en lugar de `localhost`
- Seed crea datos duplicados si se ejecuta dos veces
- Falta offline support en mobile
- Falta manejo de errores en algunos componentes

## � Soporte

Para problemas o dudas:
1. Revisar `INSTALACION-DEMO.md`
2. Revisar `backend/README.md`
3. Verificar logs en consola

## 📄 Licencia

Privado - Propiedad de DES

---

**Estado:** Demo funcional
**Última actualización:** 2024-11-06
**Versión:** 1.0.0-DEMO