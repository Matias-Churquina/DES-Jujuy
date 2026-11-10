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
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   Checking Android Environment...
echo ========================================
echo.

REM Check if Android SDK is configured
if not exist "%ANDROID_HOME%" (
    echo [WARNING] ANDROID_HOME not set
    echo Please install Android Studio and configure Android SDK
    echo.
)

REM Check devices
adb devices >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] ADB not found. Make sure Android SDK is in PATH
) else (
    echo Checking connected devices...
    adb devices
)

echo.
echo ========================================
echo   Starting React Native...
echo ========================================
echo.
echo Make sure:
echo 1. Android Studio is installed
echo 2. Android SDK is configured
echo 3. Device/emulator is connected
echo.
echo Press Ctrl+C to stop
echo.

call npm run android
