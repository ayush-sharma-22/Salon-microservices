package com.ayush.payment.service.client;


import com.ayush.payment.payload.dto.SalonDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("SALON-SERVICE")
public interface SalonFeignClient {
    @GetMapping("/api/salons/owner")
    public ResponseEntity<SalonDTO> getSalonByOwnerId(@RequestHeader("Authorization") String jwt);

    @GetMapping("/api/salons/{id}")
    public ResponseEntity<SalonDTO> getSalonById(@PathVariable Long id);
}
