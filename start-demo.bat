@echo off
echo ========================================
echo   DES - Destino Express Service
echo   Demo Startup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the DES directory
    pause
    exit /b 1
)

echo Starting DES Demo...
echo.

REM Start PostgreSQL check
echo [1/4] Checking PostgreSQL...
pg_isready >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL not running. Please start it first.
    echo.
)

REM Backend setup
echo [2/4] Setting up backend...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Database check
echo [3/4] Checking database...
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='des_db'" >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating database...
    psql -U postgres -c "CREATE DATABASE des_db;"
    echo Running seed...
    call npm run seed
) else (
    echo Database exists. Checking if seed needed...
)

echo [4/4] Starting services...
echo.
echo Backend starting at http://localhost:3000
echo API Documentation at http://localhost:3000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================

call npm run start:dev
