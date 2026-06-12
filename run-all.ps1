# ============================================================
#  Salon Microservices - PowerShell Run Script
#  Launches all services in separate console windows using Java 21
# ============================================================

$JavaPath = "$env:JAVA_HOME\bin\java.exe"
$BaseDir = "c:\Users\ASUS\Downloads\Telegram Desktop\Wd\JAVA Backend\Spring\Microservices\Salon-microservices\Salon Application"

if (-not (Test-Path $JavaPath)) {
    Write-Error "JAVA_HOME is not set correctly or java.exe is missing at $JavaPath"
    exit 1
}

Write-Host "Using Java: $JavaPath" -ForegroundColor Green

# Define services and their relative jar paths
$Services = @(
    @{ Name = "Eureka Service"; Jar = "eureka-service\target\eureka-service-0.0.1-SNAPSHOT.jar"; Delay = 15 }
    @{ Name = "Gateway Server"; Jar = "gateway-server\target\gateway-server-0.0.1-SNAPSHOT.jar"; Delay = 5 }
    @{ Name = "User Service";   Jar = "user-service\target\user-service-0.0.1-SNAPSHOT.jar";   Delay = 2 }
    @{ Name = "Salon Service";  Jar = "salon-service\target\salon-service-0.0.1-SNAPSHOT.jar";  Delay = 2 }
    @{ Name = "Category Service"; Jar = "category-service\target\category-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "Service Offering"; Jar = "service-offering\target\service-offering-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "Booking Service"; Jar = "booking-service\target\booking-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "Payment Service"; Jar = "payment-service\target\payment-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "Notification Service"; Jar = "notification-service\target\notification-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "Review Service";  Jar = "review-service\target\review-service-0.0.1-SNAPSHOT.jar";  Delay = 0 }
)

foreach ($Svc in $Services) {
    $JarPath = Join-Path $BaseDir $Svc.Jar
    if (Test-Path $JarPath) {
        Write-Host "[STARTING] $($Svc.Name)..." -ForegroundColor Yellow
        Start-Process -FilePath $JavaPath -ArgumentList "-Xmx128m", "-jar", "`"$JarPath`"" -WindowStyle Normal
        if ($Svc.Delay -gt 0) {
            Start-Sleep -Seconds $Svc.Delay
        }
    } else {
        Write-Warning "[MISSING] Jar file not found for $($Svc.Name) at $JarPath"
    }
}

Write-Host "============================================================" -ForegroundColor Green
Write-Host " All services triggered successfully in separate windows!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
