# ============================================================
#  Salon Microservices - Stop Script
#  Stops all running Java processes started by the launch script
# ============================================================

Write-Host "Stopping all Java microservice processes..." -ForegroundColor Yellow

$JavaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue

if ($JavaProcesses) {
    foreach ($Proc in $JavaProcesses) {
        Write-Host "Killing process ID: $($Proc.Id) ($($Proc.ProcessName))" -ForegroundColor Cyan
        Stop-Process -Id $Proc.Id -Force
    }
    Write-Host "All Java processes stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "No active Java processes found." -ForegroundColor Gray
}
