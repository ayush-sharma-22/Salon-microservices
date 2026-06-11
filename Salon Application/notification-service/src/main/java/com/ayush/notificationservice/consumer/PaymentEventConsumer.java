package com.ayush.notificationservice.consumer;

import com.ayush.notificationservice.dto.BookingDTO;
import com.ayush.notificationservice.dto.event.PaymentSuccessEvent;
import com.ayush.notificationservice.model.Notification;
import com.ayush.notificationservice.service.NotificationService;
import com.ayush.notificationservice.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @KafkaListener(topics = "payment-events", groupId = "notification-group")
    public void consumePaymentSuccessEvent(PaymentSuccessEvent event) {
        log.info("Received PaymentSuccessEvent in notification-service: {}", event);
        try {
            // Retrieve booking info to get Salon details
            BookingDTO bookingDTO = bookingFeignClient.getBookingById(event.getBookingId()).getBody();
            Long salonId = (bookingDTO != null) ? bookingDTO.getSalonId() : null;

            Notification notification = new Notification();
            notification.setBookingId(event.getBookingId());
            notification.setUserId(event.getUserId());
            notification.setSalonId(salonId);
            notification.setType("PAYMENT_SUCCESS");
            notification.setDescription("Your booking payment of " + event.getAmount() + " was successful!");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);

            notificationService.createNotification(notification);
            log.info("Notification successfully generated and saved for booking ID: {}", event.getBookingId());
        } catch (Exception e) {
            log.error("Failed to generate notification for booking ID: {}", event.getBookingId(), e);
        }
    }
}
