package com.ayush.payment.payload.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuccessEvent {
    private Long bookingId;
    private Long userId;
    private Long amount;
    private String paymentMethod;
    private String paymentId;
}
