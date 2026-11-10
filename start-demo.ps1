Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DES - Destino Express Service" -ForegroundColor Cyan
Write-Host "  Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend")) {
    Write-Host "[ERROR] Please run this script from the DES directory" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Starting DES Backend Demo..." -ForegroundColor Green
Write-Host ""

# Check PostgreSQL
Write-Host "[1/4] Checking PostgreSQL..." -ForegroundColor Yellow
try {
    pg_isready | Out-Null
    Write-Host "      PostgreSQL is running" -ForegroundColor Green
} catch {
    Write-Host "      [WARNING] PostgreSQL not responding" -ForegroundColor Yellow
    Write-Host "      Please start PostgreSQL service first" -ForegroundColor Yellow
    Write-Host ""
}

# Backend setup
Write-Host "[2/4] Setting up backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "      Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      [ERROR] Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
}

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "      Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
}

# Database check
Write-Host "[3/4] Checking database..." -ForegroundColor Yellow
try {
    $dbCheck = psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='des_db'" 2>&1
    if ($dbCheck -match "des_db") {
        Write-Host "      Database 'des_db' exists" -ForegroundColor Green
    } else {
        Write-Host "      Creating database..." -ForegroundColor Yellow
        psql -U postgres -c "CREATE DATABASE des_db;" | Out-Null
        Write-Host "      Database created" -ForegroundColor Green

        Write-Host "      Running seed..." -ForegroundColor Yellow
        npm run seed
        Write-Host "      Seed completed" -ForegroundColor Green
    }
} catch {
    Write-Host "      [WARNING] Could not verify database" -ForegroundColor Yellow
    Write-Host "      Continuing anyway..." -ForegroundColor Yellow
}

Write-Host "[4/4] Starting services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "  API Docs: http://localhost:3000/api/docs" -ForegroundColor Green
Write-Host "  WebSocket: ws://localhost:3000/des" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run start:dev
