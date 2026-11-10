# 🚀 INSTALACIÓN RÁPIDA - DEMO DES

## Prerrequisitos
- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- React Native CLI instalado (`npm install -g react-native-cli`)
- Android Studio o Xcode (para mobile)

## ⚡ Instalación en 5 minutos

### 1. Clonar el repositorio
```bash
cd C:\Users\Misael.ch\Documents\PericoPerico\DES
```

### 2. Backend (5 minutos)

```bash
# Ir a carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE des_db;"

# Ejecutar seed de datos demo
npm run seed

# Iniciar servidor
npm run start:dev
```

**Verificar que funcione:**
- Abrir http://localhost:3000/api/docs
- Deberías ver Swagger UI con todos los endpoints

### 3. Mobile (Android - 10 minutos)

```bash
# En otra terminal, ir a carpeta mobile
cd mobile

# Instalar dependencias
npm install

# Conectar dispositivo Android o iniciar emulador
adb devices

# Ejecutar en Android
npm run android
```

**Nota:** Si no tienes Android Studio o dispositivo, podemos crear una versión web demo con React Native Web.

### Opción Rápida: Scripts Automatizados

También puedes usar los scripts incluidos (funcionan en PowerShell o CMD):

```powershell
# Verificar requisitos previos
.\check-demo.cmd      # Para PowerShell o CMD clásico
.\check-demo.ps1      # Para PowerShell moderno

# Iniciar backend automáticamente
.\start-demo.cmd      # Para PowerShell o CMD clásico
.\start-demo.ps1      # Para PowerShell moderno

# Iniciar mobile automáticamente
.\start-mobile.cmd    # Para PowerShell o CMD clásico
.\start-mobile.ps1    # Para PowerShell moderno
```

**IMPORTANTE:** En PowerShell, usa `.\` antes del nombre del archivo:
- ✅ `.\check-demo.cmd` 
- ✅ `.\start-demo.ps1`
- ❌ `check-demo.cmd` (sin `.\` no funciona)

### 4. Probar la demo

#### Backend
1. Abrir http://localhost:3000/api/docs
2. Usar endpoint POST /auth/login
3. Credenciales demo:
   - Email: `admin@des.com`
   - Password: `demo123`

#### Mobile
1. Abrir app en Android/iOS
2. Login con:
   - Email: `admin@des.com` (Admin)
   - Email: `carlos.chofer@des.com` (Chofer)
   - Email: `ana.pasajero@des.com` (Pasajero)

## 🎯 Funcionalidades Demo

### ✅ Backend
- ✅ Autenticación JWT
- ✅ Multi-tenant (remiserías)
- ✅ CRUD choferes
- ✅ CRUD viajes
- ✅ WebSocket básico
- ✅ Datos demo incluidos

### ✅ Mobile
- ✅ Login funcional
- ✅ Navegación por roles
- ✅ Pantalla pasajero con viajes
- ✅ Pantalla chofer con estado
- ✅ Pantalla admin con estadísticas
- ✅ Conexión a API backend

### ❌ En desarrollo (no incluido en demo)
- ⏳ Sistema de paquetes completo
- ⏳ Trazabilidad en tiempo real
- ⏳ Mapa personalizado Uber-style
- ⏳ Pagos MercadoPago integrados
- ⏳ Push notifications
- ⏳ GPS tracking real-time

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar PostgreSQL
pg_isready

# Verificar puerto
netstat -an | findstr 3000

# Crear .env manualmente
copy .env.example .env
```

### Mobile no compila
```bash
# Limpiar cache
npm start -- --reset-cache

# En Android
cd android && ./gradlew clean && cd ..

# En iOS
cd ios && pod install && cd ..
```

### Error de conexión mobile-backend
- Verificar que el backend esté corriendo
- En Android emulator: usar `10.0.2.2` en lugar de `localhost`
- En iOS simulator: usar `localhost` directamente

## 📱 Demo Alternativa (Web)

Si no tienes Android/iOS, podemos crear una versión web rápida:

```bash
# En mobile/
npm install react-native-web react-dom @expo/webpack-config
npx expo start --web
```

## 🎬 Script de Presentación

1. **Abrir Swagger** → Mostrar endpoints disponibles
2. **Login con admin** → Mostrar JWT token
3. **Listar choferes** → Mostrar datos reales
4. **Abrir mobile** → Mostrar app funcional
5. **Cambiar estado chofer** → Mostrar actualización en tiempo real (WebSocket)

## 📊 Datos Demo Incluidos

- 1 remisería: "Remises Demo Jujuy"
- 2 choferes con GPS
- 2 pasajeros
- 2 autos
- 2 viajes programados (Perico ↔ San Salvador)

## 🚀 Próximos Pasos

1. **Agregar mapa real** (React Native Maps)
2. **Implementar GPS real** (react-native-geolocation)
3. **Sistema de paquetes completo**
4. **Notificaciones push** (Firebase)
5. **UI/UX profesional** (Uber-style)

---

**¿Problemas?** Revisa los logs:
- Backend: terminal donde corre `npm run start:dev`
- Mobile: Metro bundler (terminal separada)
- Database: logs de PostgreSQL