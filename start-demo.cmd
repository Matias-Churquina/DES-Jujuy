@echo off
echo ========================================
echo   DES - Destino Express Service
echo   Backend Startup
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo [ERROR] Please run this script from the DES directory
    pause
    exit /b 1
)

echo Starting DES Backend Demo...
echo.

REM Check PostgreSQL
echo [1/4] Checking PostgreSQL...
pg_isready >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL not responding
    echo Please start PostgreSQL service first
    echo.
)

REM Backend setup
echo [2/4] Setting up backend...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check .env
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env >nul 2>&1
)

REM Database check
echo [3/4] Checking database...
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='des_db'" >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating database...
    psql -U postgres -c "CREATE DATABASE des_db;"
    if %errorlevel% neq 0 (
        echo [ERROR] Could not create database
        echo Please create database manually: CREATE DATABASE des_db;
        pause
        exit /b 1
    )
    echo Running seed...
    call npm run seed
    if %errorlevel% neq 0 (
        echo [WARNING] Seed failed, but continuing...
    )
) else (
    echo Database exists.
)

echo [4/4] Starting services...
echo.
echo ========================================
echo   Backend: http://localhost:3000
echo   API Docs: http://localhost:3000/api/docs
echo   WebSocket: ws://localhost:3000/des
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run start:dev
