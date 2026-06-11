package com.ayush.bookingservice.dto;

import lombok.Data;

@Data
public class PaymentLinkResponse {
    private String paymentLinkUrl;

    private String paymentLinkId;
}
