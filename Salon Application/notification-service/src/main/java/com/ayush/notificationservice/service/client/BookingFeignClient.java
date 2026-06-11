package com.ayush.notificationservice.service.client;

import com.ayush.notificationservice.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("BOOKING-SERVICE")
public interface BookingFeignClient {

    @GetMapping("/api/bookings/{id}")
    ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id);
}
