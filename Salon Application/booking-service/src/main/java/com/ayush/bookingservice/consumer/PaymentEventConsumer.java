package com.ayush.bookingservice.consumer;

import com.ayush.bookingservice.dto.event.PaymentSuccessEvent;
import com.ayush.bookingservice.enums.BookingStatus;
import com.ayush.bookingservice.services.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final BookingService bookingService;

    @KafkaListener(topics = "payment-events", groupId = "booking-group")
    public void consumePaymentSuccessEvent(PaymentSuccessEvent event) {
        log.info("Received PaymentSuccessEvent in booking-service: {}", event);
        try {
            bookingService.updateBooking(BookingStatus.CONFIRMED, event.getBookingId());
            log.info("Successfully updated booking ID: {} to CONFIRMED status", event.getBookingId());
        } catch (Exception e) {
            log.error("Failed to update booking status for booking ID: {}", event.getBookingId(), e);
        }
    }
}
