@echo off
echo ========================================
echo   DES Mobile - Destino Express Service
echo   Mobile Demo Startup
echo ========================================
echo.

cd mobile

if not exist "node_modules" (
    echo Installing mobile dependencies...
    call npm install
)

echo.
echo ========================================
echo   Iniciando React Native...
echo ========================================
echo.
echo Make sure:
echo 1. Android Studio is installed
echo 2. Android SDK is configured
echo 3. Device/emulator is connected
echo.
echo Checking devices...

adb devices

echo.
echo Starting Metro Bundler and App...
call npm run android
