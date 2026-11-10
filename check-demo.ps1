Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DES Demo - Verification Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allPassed = $true

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "      Node.js: $nodeVersion" -ForegroundColor Gray
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "      [ERROR] Node.js not installed" -ForegroundColor Red
    $allPassed = $false
}

# Check npm
Write-Host "[2/5] Checking npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "      npm: $npmVersion" -ForegroundColor Gray
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "      [ERROR] npm not installed" -ForegroundColor Red
    $allPassed = $false
}

# Check PostgreSQL
Write-Host "[3/5] Checking PostgreSQL..." -NoNewline
try {
    $psqlVersion = psql --version
    Write-Host " ✓" -ForegroundColor Green
    Write-Host "      PostgreSQL: $psqlVersion" -ForegroundColor Gray
} catch {
    Write-Host " ⚠" -ForegroundColor Yellow
    Write-Host "      [WARNING] PostgreSQL not in PATH" -ForegroundColor Yellow
    Write-Host "      Install PostgreSQL or add to PATH" -ForegroundColor Yellow
}

# Check React Native CLI
Write-Host "[4/5] Checking React Native CLI..." -NoNewline
try {
    react-native --version | Out-Null
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ⚠" -ForegroundColor Yellow
    Write-Host "      [WARNING] React Native CLI not installed" -ForegroundColor Yellow
    Write-Host "      Install with: npm install -g react-native-cli" -ForegroundColor Yellow
}

# Check Java (for Android)
Write-Host "[5/5] Checking Java..." -NoNewline
try {
    java -version 2>&1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
} catch {
    Write-Host " ⚠" -ForegroundColor Yellow
    Write-Host "      [WARNING] Java not installed (needed for Android)" -ForegroundColor Yellow
    Write-Host "      Install Java JDK 11 or higher" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "  ✓ All checks passed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ready to run DES Demo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  Backend:  .\start-demo.cmd  OR  .\start-demo.ps1  OR  npm run start:dev" -ForegroundColor White
    Write-Host "  Mobile:   .\start-mobile.cmd OR  .\start-mobile.ps1 OR  npm run android" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "  ✗ Missing dependencies" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please install missing dependencies and try again." -ForegroundColor Red
    Write-Host ""
    Write-Host "Required:" -ForegroundColor Yellow
    Write-Host "  - Node.js 18+ (https://nodejs.org)" -ForegroundColor White
    Write-Host "  - npm (comes with Node.js)" -ForegroundColor White
    Write-Host "  - PostgreSQL 12+ (https://www.postgresql.org)" -ForegroundColor White
    Write-Host ""
    Write-Host "Optional (for mobile):" -ForegroundColor Yellow
    Write-Host "  - Android Studio (for Android development)" -ForegroundColor White
    Write-Host "  - Java JDK 11+ (for Android builds)" -ForegroundColor White
    Write-Host "  - React Native CLI (npm install -g react-native-cli)" -ForegroundColor White
    Write-Host ""
    pause
}
