@echo off
echo ============================================
echo   RakshaNet Shield - Project Setup
echo ============================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Node.js found:
node --version

echo.
echo [2/3] Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo [3/3] Starting development server...
echo.
echo ============================================
echo   Opening http://localhost:3000 in your browser...
echo ============================================
echo.
start http://localhost:3000
call npm run dev
