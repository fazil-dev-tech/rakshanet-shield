@echo off
echo ============================================
echo   RakshaNet Shield - Deep Clean ^& Reinstall
echo ============================================
echo.

echo [1/4] Deleting old node_modules cache...
if exist "node_modules" rmdir /s /q node_modules

echo [2/4] Deleting Next.js build cache...
if exist ".next" rmdir /s /q .next

echo [3/4] Deleting package lockfile...
if exist "package-lock.json" del package-lock.json

echo.
echo [4/4] Performing clean dependency installation...
call npm install --legacy-peer-deps

echo.
echo ============================================
echo   Starting fresh development server...
echo ============================================
call npm run dev
