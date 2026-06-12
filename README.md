<div align="center">

# 💈 Salon Booking Platform

A production-ready, cloud-native **salon booking system** built with Java Spring Boot microservices, secured with Keycloak OAuth2, and powered by Apache Kafka event streaming.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=flat-square&logo=springboot)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.3-brightgreen?style=flat-square&logo=spring)
![Keycloak](https://img.shields.io/badge/Keycloak-OAuth2%2FJWT-blue?style=flat-square&logo=keycloak)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-Event%20Streaming-black?style=flat-square&logo=apachekafka)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)

</div>

---

## 📌 Overview

The Salon Booking Platform is a full-stack, microservices-based application that allows customers to discover salons, browse service catalogs, book appointments, and pay online — all in one place. Salon owners get a dedicated admin panel to manage their branch, services, bookings, and revenue reports.

The backend is built on **Spring Boot + Spring Cloud** with **Netflix Eureka** for service discovery, **Spring Cloud Gateway** for routing and JWT validation, and **Apache Kafka** for asynchronous event streaming between services. Authentication is fully delegated to **Keycloak**, an enterprise-grade identity provider.

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────┐
                    │    Keycloak  (Port 9090)      │
                    │   OAuth2 / JWT Auth Server    │
                    └──────────────┬───────────────┘
                                   │ JWT Validation
   React Frontend  ────────────────▼───────────────────────────────────
   (Vite + Tailwind)         API Gateway  (Port 8000)
                             Spring Cloud Gateway
                    ┌────────────────────────────────────────────────┐
                    │   Routes + JWT Security Filter                 │
                    └──┬───┬───┬───┬───┬───┬───┬───┬───────────────┘
                       │   │   │   │   │   │   │   │
          ┌────────────┘   │   │   │   │   │   │   └──────────────┐
          ▼                ▼   ▼   ▼   ▼   ▼   ▼                 ▼
       user           salon  cat  svc  book pay notif          review
      :8080           :8081 :8082 :8083 :8084 :8085 :8086       :8087
        │               │    │    │     │    │    │               │
      userdb          salondb catdb svcdb bookdb paydb notifdb  reviewdb
      :3307           :3308 :3309 :3310 :3311 :3312 :3315       :3314

                    ┌──────────────────────────────┐
                    │   Eureka Server  (Port 5000)  │
                    │      Service Registry         │
                    └──────────────────────────────┘

                    ┌──────────────────────────────┐
                    │   Apache Kafka  (Port 9092)   │
                    │      Event Broker             │
                    └──────────────────────────────┘
```

---

## 🧩 Microservices

| Service | Port | DB Port | Description |
|---------|------|---------|-------------|
| `eureka-service` | `5000` | — | Service registry — all microservices self-register and heartbeat here |
| `gateway-server` | `8000` | — | API Gateway — routes traffic, validates JWT via Keycloak JWKS |
| `user-service` | `8080` | `3307` | User auth and profile management via Keycloak integration |
| `salon-service` | `8081` | `3308` | Salon branch registration, schedules, and owner management |
| `category-service` | `8082` | `3309` | Service categories per salon (Haircut, Spa, Massage, etc.) |
| `service-offering` | `8083` | `3310` | Service catalog with pricing, duration, and category mapping |
| `booking-service` | `8084` | `3311` | Appointment scheduling, slot conflict detection, status machine |
| `payment-service` | `8085` | `3312` | Payment processing via Razorpay and Stripe, Kafka event publisher |
| `notification-service` | `8086` | `3315` | Booking and payment notifications, Kafka consumer |
| `review-service` | `8087` | `3314` | Customer ratings, feedback, and salon average scores |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Backend Framework | Spring Boot 3.3.5 |
| Service Discovery | Netflix Eureka (Spring Cloud) |
| API Gateway | Spring Cloud Gateway (WebFlux / Reactive) |
| Authentication | Keycloak + OAuth2 + JWT |
| Inter-service Calls | OpenFeign (load-balanced via Eureka) |
| Event Streaming | Apache Kafka |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8.0 (isolated DB per service) |
| Payment Gateways | Razorpay SDK + Stripe SDK |
| Frontend | React 18 + Vite + Tailwind CSS + Axios |
| Containerization | Docker + Docker Compose |
| Image Building | Google Jib (no Dockerfile needed) |

---

## 🔐 Authentication & Authorization

Authentication is fully delegated to **Keycloak**. The gateway validates every incoming request against Keycloak's JWKS endpoint before forwarding to any downstream service.

```
1. POST /auth/signup  →  Creates user in Keycloak + assigns role + saves profile in userdb
2. POST /auth/login   →  Exchanges credentials with Keycloak → returns JWT access + refresh token
3. All API requests   →  Gateway validates JWT signature via Keycloak JWKS certs
4. Role enforcement   →  Gateway checks ROLE_CUSTOMER / ROLE_OWNER / ROLE_ADMIN from JWT claims
```

### Roles

| Role | Access |
|------|--------|
| `CUSTOMER` | Browse salons, view services, book appointments, pay, leave reviews, view notifications |
| `OWNER` | Manage own salon, categories, services, view bookings, view reports, receive notifications |
| `ADMIN` | Full platform access |

The frontend uses an **Axios request interceptor** that automatically attaches `Authorization: Bearer <token>` to every outgoing request from `localStorage`. Role-based route guards (`OwnerRoute`) in `App.jsx` restrict admin panel access to `OWNER` users only.

---

## 🔄 Event-Driven Architecture (Kafka)

The platform uses **Apache Kafka** for asynchronous, decoupled communication between services after payment completion.

```
  Razorpay / Stripe confirms payment
              │
              ▼
  payment-service  ──publishes──▶  Topic: "payment-events"
                                           │
                       ┌───────────────────┴───────────────────┐
                       ▼                                       ▼
              booking-service                      notification-service
         Consumes PaymentEvent                   Consumes PaymentEvent
      Updates booking → CONFIRMED             Creates notification record
      or CANCELLED on failure                 "Your booking is confirmed!"
```

**PaymentEvent payload:**
```json
{
  "bookingId": 4,
  "userId": 10,
  "salonId": 3,
  "status": "SUCCESS"
}
```

This eliminates tight coupling — `payment-service` never directly calls `booking-service` or `notification-service`. Each service reacts independently to the same event.

---

## 📅 Booking Status Machine

```
  Create Booking
       │
       ▼
   PENDING  ──── Payment fails ────▶  CANCELLED
       │
       │  Kafka: PaymentEvent SUCCESS
       ▼
  CONFIRMED  ──── Appointment done ──▶  COMPLETED
                  (Owner updates)
```

Slot conflict detection runs before saving — the booking service checks all existing bookings for the salon on that date to prevent double-booking.

---

## 🚀 Getting Started

### Prerequisites

- Java 21
- Maven 3.x
- Docker & Docker Compose
- Node.js & npm (for frontend)

### 1. Clone the repository

```bash
git clone https://github.com/ayush-sharma-22/Salon-microservices.git
cd Salon-microservices
```

### 2. Start infrastructure

```bash
docker-compose up -d kafka keycloak-db keycloak
```

### 3. Build all services

```bash
./build-all.bat
```

### 4. Start all services

```powershell
powershell -ExecutionPolicy Bypass -File .\run-in-terminal.ps1
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Stop all services

```powershell
powershell -ExecutionPolicy Bypass -File .\stop-all.ps1
```

### Access points

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| API Gateway | `http://localhost:8000` |
| Eureka Dashboard | `http://localhost:5000` |
| Keycloak Admin | `http://localhost:9090` |

---

## 📡 API Reference

### Auth
```
POST   /auth/login                               Login — returns JWT + refresh token
POST   /auth/signup                              Register new user with role
GET    /auth/access-token/refresh-token/{token}  Refresh access token
```

### Users
```
GET    /api/users/profile        Authenticated user profile
GET    /api/users/{id}           Get user by ID
PUT    /api/users/{id}           Update user
DELETE /api/users/{id}           Delete user
```

### Salons
```
GET    /api/salons                List all salons
GET    /api/salons/{id}           Get salon by ID
GET    /api/salons/owner          Get owner's salon (OWNER)
POST   /api/salons                Create salon (OWNER)
PUT    /api/salons/{id}           Update salon (OWNER)
```

### Categories
```
GET    /api/categories                     All categories
GET    /api/categories/salon/{salonId}     Categories by salon
POST   /api/categories/salon-owner         Create category (OWNER)
DELETE /api/categories/salon-owner/{id}    Delete category (OWNER)
```

### Service Offerings
```
GET    /api/service-offering/salon/{id}          Services by salon
GET    /api/service-offering/list?ids=...        Services by IDs
POST   /api/service-offering/salon-owner         Create service (OWNER)
PUT    /api/service-offering/salon-owner/{id}    Update service (OWNER)
```

### Bookings
```
POST   /api/bookings?salonId=&paymentMethod=       Create booking + payment link
GET    /api/bookings/customer                      Customer booking history
GET    /api/bookings/salon                         Salon bookings (OWNER)
GET    /api/bookings/{id}                          Get booking by ID
PUT    /api/bookings/{id}?status=                  Update booking status
GET    /api/bookings/slots/salon/{id}/date?date=   Booked slots by date
GET    /api/bookings/report                        Salon earnings report (OWNER)
```

### Payments
```
GET    /api/payments/{paymentOrderId}                            Payment details
PATCH  /api/payments/proceed?paymentId=&paymentLinkId=           Confirm payment
```

### Notifications
```
GET    /api/notifications/user/{userId}        User notifications
GET    /api/notifications/salon/{salonId}      Salon notifications (OWNER)
PATCH  /api/notifications/{id}/read           Mark as read
```

### Reviews
```
GET    /api/reviews/salon/{salonId}          Reviews for a salon
POST   /api/reviews/create/salon/{salonId}   Submit review (CUSTOMER)
PUT    /api/reviews/{reviewId}               Edit review
DELETE /api/reviews/{reviewId}               Delete review
```

---

## 🐳 Docker Deployment

Build all Docker images with Google Jib (no Dockerfile required):

```bash
# Build image for each service
mvn compile jib:dockerBuild -pl user-service
mvn compile jib:dockerBuild -pl salon-service
mvn compile jib:dockerBuild -pl category-service
mvn compile jib:dockerBuild -pl service-offering
mvn compile jib:dockerBuild -pl booking-service
mvn compile jib:dockerBuild -pl payment-service
mvn compile jib:dockerBuild -pl notification-service
mvn compile jib:dockerBuild -pl review-service
mvn compile jib:dockerBuild -pl gateway-server
mvn compile jib:dockerBuild -pl eureka-service
```

Run the full stack:

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
Salon-microservices/
├── eureka-service/          # Service registry
├── gateway-server/          # API gateway + security
├── user-service/            # Auth + user management
├── salon-service/           # Salon branch management
├── category-service/        # Service categories
├── service-offering/        # Service catalog
├── booking-service/         # Appointments + scheduling
├── payment-service/         # Razorpay + Stripe
├── notification-service/    # Kafka consumer + notifications
├── review-service/          # Ratings + reviews
├── frontend/                # React + Vite + Tailwind
├── docker-compose/
│   └── default/
│       └── docker-compose.yml
├── build-all.bat            # Build all services
├── run-in-terminal.ps1      # Start all services
└── stop-all.ps1             # Stop all services
```

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/ayush-sharma-22">Ayush Sharma</a>
</div>