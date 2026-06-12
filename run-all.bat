@echo off
echo ============================================================
echo  Starting Salon Microservices via JAR Files (Java 21)
echo ============================================================

set BASE=c:\Users\ASUS\Downloads\Telegram Desktop\Wd\JAVA Backend\Spring\Microservices\Salon-microservices\Salon Application
set JAVA_EXEC="%JAVA_HOME%\bin\java.exe"

echo [START] Starting Eureka Discovery Server (Port 5000)...
start "Eureka Service" %JAVA_EXEC% -jar "%BASE%\eureka-service\target\eureka-service-0.0.1-SNAPSHOT.jar"
ping 127.0.0.1 -n 15 > nul

echo [START] Starting Gateway Server (Port 8000)...
start "Gateway Server" %JAVA_EXEC% -jar "%BASE%\gateway-server\target\gateway-server-0.0.1-SNAPSHOT.jar"
ping 127.0.0.1 -n 5 > nul

echo [START] Starting User Service (Port 8085)...
start "User Service" %JAVA_EXEC% -jar "%BASE%\user-service\target\user-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Salon Service (Port 8081)...
start "Salon Service" %JAVA_EXEC% -jar "%BASE%\salon-service\target\salon-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Category Service (Port 8082)...
start "Category Service" %JAVA_EXEC% -jar "%BASE%\category-service\target\category-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Service Offering Service (Port 8083)...
start "Service Offering" %JAVA_EXEC% -jar "%BASE%\service-offering\target\service-offering-0.0.1-SNAPSHOT.jar"

echo [START] Starting Booking Service (Port 8084)...
start "Booking Service" %JAVA_EXEC% -jar "%BASE%\booking-service\target\booking-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Payment Service (Port 8086)...
start "Payment Service" %JAVA_EXEC% -jar "%BASE%\payment-service\target\payment-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Notification Service (Port 8087)...
start "Notification Service" %JAVA_EXEC% -jar "%BASE%\notification-service\target\notification-service-0.0.1-SNAPSHOT.jar"

echo [START] Starting Review Service (Port 8088)...
start "Review Service" %JAVA_EXEC% -jar "%BASE%\review-service\target\review-service-0.0.1-SNAPSHOT.jar"

echo ============================================================
echo  All services triggered using correct path quoting!
echo ============================================================
