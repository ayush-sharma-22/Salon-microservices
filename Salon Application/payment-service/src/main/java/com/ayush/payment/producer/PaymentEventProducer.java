package com.ayush.payment.producer;

import com.ayush.payment.payload.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private static final String TOPIC = "payment-events";
    private final KafkaTemplate<String, PaymentSuccessEvent> kafkaTemplate;

    public void sendPaymentSuccessEvent(PaymentSuccessEvent event) {
        log.info("Publishing payment success event to Kafka: {}", event);
        kafkaTemplate.send(TOPIC, event.getBookingId().toString(), event);
    }
}
