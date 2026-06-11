package com.ayush.bookingservice.services.client;

import com.ayush.bookingservice.dto.BookingDTO;
import com.ayush.bookingservice.dto.PaymentLinkResponse;
import com.ayush.bookingservice.enums.PaymentMethod;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("PAYMENT-SERVICE")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    ResponseEntity<PaymentLinkResponse> createPaymentLink(@RequestBody BookingDTO bookingDTO,
                                                          @RequestParam PaymentMethod paymentMethod,
                                                          @RequestHeader("Authorization") String jwt
                                                          );
}
