@echo off
echo ========================================
echo   DES Demo - Verification Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not installed
    goto :error
) else (
    for /f "tokens=*" %%i in ('node --version') do echo    Node.js: %%i
)

REM Check npm
echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not installed
    goto :error
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo    npm: %%i
)

REM Check PostgreSQL
echo [3/5] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL not installed
    goto :error
) else (
    for /f "tokens=*" %%i in ('psql --version') do echo    PostgreSQL: %%i
)

REM Check React Native CLI
echo [4/5] Checking React Native CLI...
react-native --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  React Native CLI not installed
    echo    Install with: npm install -g react-native-cli
) else (
    echo    React Native CLI installed
)

REM Check Java/Android SDK (for Android)
echo [5/5] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Java not installed (needed for Android)
    echo    Install Java JDK 11 or higher
) else (
    echo    Java installed
)

echo.
echo ========================================
echo   ✅ All checks passed!
echo ========================================
echo.
echo Ready to run DES Demo!
echo.
echo Next steps:
echo 1. Run start-demo.bat for backend
echo 2. Run start-mobile.bat for mobile
echo.
goto :end

:error
echo.
echo ========================================
echo   ❌ Missing dependencies
echo ========================================
echo.
echo Please install missing dependencies and try again.
echo.
:end
pause
