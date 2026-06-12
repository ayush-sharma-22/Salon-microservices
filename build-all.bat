@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM  Salon Microservices - JAR Build Script
REM  Builds all services with: mvn clean package -DskipTests
REM  Skipping tests speeds up build & reduces memory usage.
REM ============================================================

set BASE="c:\Users\ASUS\Downloads\Telegram Desktop\Wd\JAVA Backend\Spring\Microservices\Salon-microservices\Salon Application"

set SERVICES=eureka-service gateway-server user-service salon-service category-service service-offering booking-service payment-service notification-service review-service

set PASS=0
set FAIL=0

echo.
echo  ██████████████████████████████████████████
echo   Salon Microservices - JAR Build Pipeline
echo  ██████████████████████████████████████████
echo.

for %%S in (%SERVICES%) do (
    echo [BUILD] %%S ...
    pushd %BASE%\%%S
    call mvnw.cmd clean package -DskipTests -q 2^>^&1
    if !errorlevel! == 0 (
        echo  [OK] %%S built successfully
        set /a PASS+=1
    ) else (
        echo  [FAIL] %%S build FAILED
        set /a FAIL+=1
    )
    popd
    echo.
)

echo ============================================================
echo  Build Summary: !PASS! succeeded, !FAIL! failed
echo ============================================================
