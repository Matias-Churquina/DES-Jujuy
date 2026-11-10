Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DES Mobile - Destino Express Service" -ForegroundColor Cyan
Write-Host "  Mobile Demo Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location mobile

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing mobile dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checking Android Environment..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Android SDK
if (-not $env:ANDROID_HOME) {
    Write-Host "[WARNING] ANDROID_HOME not set" -ForegroundColor Yellow
    Write-Host "  Please install Android Studio and configure Android SDK" -ForegroundColor Yellow
    Write-Host ""
}

# Check devices
try {
    adb devices | Out-Null
    Write-Host "Checking connected devices..." -ForegroundColor Yellow
    adb devices
    Write-Host ""
} catch {
    Write-Host "[WARNING] ADB not found. Make sure Android SDK is in PATH" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting React Native..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure:" -ForegroundColor Yellow
Write-Host "1. Android Studio is installed" -ForegroundColor White
Write-Host "2. Android SDK is configured" -ForegroundColor White
Write-Host "3. Device/emulator is connected" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run android
