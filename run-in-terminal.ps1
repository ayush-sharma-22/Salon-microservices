# ============================================================
#  Salon Microservices - Terminal Run Script
#  Launches all services in the background of the current session
# ============================================================

$JavaPath = "$env:JAVA_HOME\bin\java.exe"
$BaseDir = "c:\Users\ASUS\Downloads\Telegram Desktop\Wd\JAVA Backend\Spring\Microservices\Salon-microservices\Salon Application"
$LogsDir = Join-Path $BaseDir "..\logs"

if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir | Out-Null
}

if (-not (Test-Path $JavaPath)) {
    Write-Error "JAVA_HOME is not set correctly or java.exe is missing at $JavaPath"
    exit 1
}

Write-Host "Using Java: $JavaPath" -ForegroundColor Green
Write-Host "Redirecting service logs to: $LogsDir" -ForegroundColor Green

# Define services and their relative jar paths
$Services = @(
    @{ Name = "eureka-service"; Jar = "eureka-service\target\eureka-service-0.0.1-SNAPSHOT.jar"; Delay = 15 }
    @{ Name = "gateway-server"; Jar = "gateway-server\target\gateway-server-0.0.1-SNAPSHOT.jar"; Delay = 5 }
    @{ Name = "user-service";   Jar = "user-service\target\user-service-0.0.1-SNAPSHOT.jar";   Delay = 2 }
    @{ Name = "salon-service";  Jar = "salon-service\target\salon-service-0.0.1-SNAPSHOT.jar";  Delay = 2 }
    @{ Name = "category-service"; Jar = "category-service\target\category-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "service-offering"; Jar = "service-offering\target\service-offering-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "booking-service"; Jar = "booking-service\target\booking-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "payment-service"; Jar = "payment-service\target\payment-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "notification-service"; Jar = "notification-service\target\notification-service-0.0.1-SNAPSHOT.jar"; Delay = 2 }
    @{ Name = "review-service";  Jar = "review-service\target\review-service-0.0.1-SNAPSHOT.jar";  Delay = 0 }
)

foreach ($Svc in $Services) {
    $JarPath = Join-Path $BaseDir $Svc.Jar
    if (Test-Path $JarPath) {
        Write-Host "[STARTING] $($Svc.Name) in background..." -ForegroundColor Yellow
        $OutFile = Join-Path $LogsDir "$($Svc.Name).log"
        $ErrFile = Join-Path $LogsDir "$($Svc.Name).err"
        
        Start-Process -FilePath $JavaPath -ArgumentList "-Xmx128m", "-jar", "`"$JarPath`"" -NoNewWindow -RedirectStandardOutput $OutFile -RedirectStandardError $ErrFile
        
        if ($Svc.Delay -gt 0) {
            Start-Sleep -Seconds $Svc.Delay
        }
    } else {
        Write-Warning "[MISSING] Jar file not found for $($Svc.Name) at $JarPath"
    }
}

Write-Host "============================================================" -ForegroundColor Green
Write-Host " All microservices triggered in the background!" -ForegroundColor Green
Write-Host " Check logs in the 'logs/' folder." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
