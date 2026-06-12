// ═══════════════════════════════════════════════════════
//  Aura Salon – Central Mock Data Store
//  All data mirrors the scanned microservice entities
// ═══════════════════════════════════════════════════════

export const CURRENT_USER = {
  id: 101, name: 'Ayush Sharma', email: 'ayush@example.com', phone: '+91-9876543210',
};

export const SALONS = [
  { id: 1, name: 'Aura Luxury Salon', address: '12 MG Road, Connaught Place', city: 'New Delhi', phoneNumber: '+91-11-4567-8900', email: 'newdelhi@aurasalon.com', ownerId: 1, openingTime: '09:00', closingTime: '20:00', rating: 4.9, reviewCount: 128, images: ['salon1'], tags: ['Color', 'Bridal', 'Wellness'] },
  { id: 2, name: 'Aura Serenity Spa', address: '45 Linking Road, Bandra West', city: 'Mumbai', phoneNumber: '+91-22-6789-0123', email: 'mumbai@aurasalon.com', ownerId: 2, openingTime: '10:00', closingTime: '21:00', rating: 4.8, reviewCount: 94, images: ['salon2'], tags: ['Facials', 'Massage', 'Manicure'] },
  { id: 3, name: 'Aura Studio & Bar', address: '7 Park Street, Park Circus', city: 'Kolkata', phoneNumber: '+91-33-2345-6789', email: 'kolkata@aurasalon.com', ownerId: 3, openingTime: '09:30', closingTime: '19:30', rating: 4.7, reviewCount: 61, images: ['salon3'], tags: ['Hair', 'Nails', 'Skin'] },
  { id: 4, name: 'Aura Atelier', address: '88 Brigade Road, Lavelle', city: 'Bangalore', phoneNumber: '+91-80-3456-7890', email: 'bangalore@aurasalon.com', ownerId: 4, openingTime: '09:00', closingTime: '21:00', rating: 4.9, reviewCount: 143, images: ['salon4'], tags: ['Balayage', 'Keratin', 'Facials'] },
];

export const CATEGORIES = [
  { id: 1, name: 'Hair', icon: '✂️' },
  { id: 2, name: 'Color', icon: '🎨' },
  { id: 3, name: 'Skin Care', icon: '✨' },
  { id: 4, name: 'Wellness', icon: '🌿' },
  { id: 5, name: 'Nails', icon: '💅' },
  { id: 6, name: 'Bridal', icon: '💍' },
];

export const SERVICE_OFFERINGS = [
  { id: 1, name: 'Signature Haircut & Style', description: 'Precision cut tailored to your face shape + luxury blowdry finish', price: 900, duration: 60, salonId: 1, categoryId: 1, images: '' },
  { id: 2, name: 'Full Balayage & Glaze', description: 'Hand-painted highlights + glossing treatment for dimension and shine', price: 3200, duration: 150, salonId: 1, categoryId: 2, images: '' },
  { id: 3, name: 'Aromatherapy Facial Ritual', description: 'Deep cleanse, exfoliation, steam and moisture mask with essential oils', price: 2200, duration: 75, salonId: 1, categoryId: 3, images: '' },
  { id: 4, name: 'Deep Tissue Massage', description: '90-minute full body therapy targeting muscle tension and stress release', price: 1800, duration: 90, salonId: 1, categoryId: 4, images: '' },
  { id: 5, name: 'Gel Manicure & Spa Pedicure', description: 'Gel colour application + hot stone pedicure with paraffin dip', price: 1400, duration: 90, salonId: 1, categoryId: 5, images: '' },
  { id: 6, name: 'Keratin Smoothing Treatment', description: 'Professional frizz elimination + silk protein infusion for 3–4 months', price: 4500, duration: 180, salonId: 1, categoryId: 2, images: '' },
  { id: 7, name: 'Bridal Makeup & Hair', description: 'Full bridal look with airbrush foundation, eye work and styled updo', price: 8500, duration: 240, salonId: 1, categoryId: 6, images: '' },
  { id: 8, name: 'Classic Eyelash Extensions', description: 'Single lash application for natural volume that lasts 3–4 weeks', price: 2000, duration: 120, salonId: 1, categoryId: 3, images: '' },
  { id: 9, name: "Men's Precision Grooming", description: 'Classic scissor cut + hot towel shave + beard shaping', price: 850, duration: 60, salonId: 1, categoryId: 1, images: '' },
  { id: 10, name: 'Scalp Treatment & Massage', description: 'Medicated scalp exfoliation + nourishing oil massage + steam', price: 1200, duration: 45, salonId: 1, categoryId: 4, images: '' },
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
];

export const BOOKED_SLOTS = ['10:00', '11:30', '14:00', '15:30'];

export const BOOKINGS = [
  { id: 1001, salonId: 1, salonName: 'Aura Luxury Salon', customerId: 101, startTime: '2026-06-11T10:30', endTime: '2026-06-11T11:30', serviceIds: [1], serviceName: 'Signature Haircut & Style', status: 'CONFIRMED', totalPrice: 900 },
  { id: 1002, salonId: 1, salonName: 'Aura Luxury Salon', customerId: 101, startTime: '2026-06-08T13:00', endTime: '2026-06-08T15:30', serviceIds: [2], serviceName: 'Full Balayage & Glaze', status: 'COMPLETED', totalPrice: 3200 },
  { id: 1003, salonId: 2, salonName: 'Aura Serenity Spa', customerId: 101, startTime: '2026-06-05T11:00', endTime: '2026-06-05T12:15', serviceIds: [3], serviceName: 'Aromatherapy Facial Ritual', status: 'COMPLETED', totalPrice: 2200 },
  { id: 1004, salonId: 1, salonName: 'Aura Luxury Salon', customerId: 101, startTime: '2026-06-15T15:00', endTime: '2026-06-15T18:00', serviceIds: [6], serviceName: 'Keratin Smoothing Treatment', status: 'PENDING', totalPrice: 4500 },
  { id: 1005, salonId: 4, salonName: 'Aura Atelier', customerId: 101, startTime: '2026-06-03T09:00', endTime: '2026-06-03T10:00', serviceIds: [9], serviceName: "Men's Precision Grooming", status: 'CANCELLED', totalPrice: 850 },
];

export const PAYMENT_ORDERS = [
  { paymentId: 501, bookingId: 1002, status: 'SUCCESS', amount: 3200, paymentMethod: 'UPI', userId: 101, salonId: 1, paymentLinkId: 'pay_Xyz123' },
  { paymentId: 502, bookingId: 1003, status: 'SUCCESS', amount: 2200, paymentMethod: 'CARD', userId: 101, salonId: 2, paymentLinkId: 'pay_Abc456' },
];

export const REVIEWS = [
  { id: 1, reviewText: 'Absolutely stunning balayage work. Elena is a true colour artist — my hair has never looked this good.', rating: 5.0, salonId: 1, userId: 101, userName: 'Ayush S.', createdAt: '2026-06-08' },
  { id: 2, reviewText: 'Quick, precise cut and the hot towel shave was surprisingly relaxing. Will definitely be back.', rating: 4.5, salonId: 1, userId: 102, userName: 'Marcus V.', createdAt: '2026-06-05' },
  { id: 3, reviewText: 'The Aromatherapy Facial left my skin glowing for almost a week. Highly recommended for anyone doing a special event.', rating: 5.0, salonId: 1, userId: 103, userName: 'Sophia P.', createdAt: '2026-06-01' },
  { id: 4, reviewText: 'Great ambience and professional staff. The massage was exactly what I needed after a stressful week.', rating: 4.5, salonId: 2, userId: 104, userName: 'Isabella R.', createdAt: '2026-05-28' },
  { id: 5, reviewText: 'Keratin treatment was flawless. Not a single frizzy strand three weeks later!', rating: 5.0, salonId: 4, userId: 105, userName: 'Alexander W.', createdAt: '2026-05-20' },
];

export const MICROSERVICES = [
  { name: 'Eureka Discovery',  artifact: 'eureka-service',       port: 8761, tech: ['Spring Cloud Netflix'], description: 'Service registry & heartbeat monitor', jar: 'eureka-service-0.0.1-SNAPSHOT.jar' },
  { name: 'API Gateway',       artifact: 'gateway-server',       port: 8060, tech: ['Gateway', 'OAuth2'],    description: 'Route load-balancing + OAuth2 JWT validation', jar: 'gateway-server-0.0.1-SNAPSHOT.jar' },
  { name: 'User Service',      artifact: 'user-service',         port: 8085, tech: ['JPA', 'MySQL', 'Feign'], description: 'User profiles, Keycloak auth, OpenFeign', jar: 'user-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Salon Service',     artifact: 'salon-service',        port: 8081, tech: ['JPA', 'MySQL'],         description: 'Branch: name, city, hours, images, ownerId', jar: 'salon-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Category Service',  artifact: 'category-service',     port: 8082, tech: ['JPA', 'MySQL'],         description: 'Service categories: Hair, Skin, Wellness…', jar: 'category-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Service Offering',  artifact: 'service-offering',     port: 8083, tech: ['JPA', 'MySQL', 'Feign'], description: 'name, price, duration, salonId, categoryId', jar: 'service-offering-0.0.1-SNAPSHOT.jar' },
  { name: 'Booking Service',   artifact: 'booking-service',      port: 8084, tech: ['JPA', 'Kafka', 'Feign'], description: 'salonId, customerId, serviceIds[], status, totalPrice', jar: 'booking-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Payment Service',   artifact: 'payment-service',      port: 8086, tech: ['JPA', 'Kafka'],         description: 'PaymentOrder: Razorpay link, userId, bookingId', jar: 'payment-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Notification Svc',  artifact: 'notification-service', port: 8087, tech: ['Kafka', 'SMTP'],        description: 'Kafka consumer → email & SMS dispatch', jar: 'notification-service-0.0.1-SNAPSHOT.jar' },
  { name: 'Review Service',    artifact: 'review-service',       port: 8088, tech: ['JPA', 'MySQL'],         description: 'rating (double), reviewText, salonId, userId', jar: 'review-service-0.0.1-SNAPSHOT.jar' },
];
