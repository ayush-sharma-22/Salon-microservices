package com.ayush.bookingservice.services.client;

import com.ayush.bookingservice.dto.ServiceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.Set;

@FeignClient("SERVICE-OFFERING")
public interface ServiceOfferingFeignClient {

    @GetMapping("/api/service-offering/list")
    public ResponseEntity<Set<ServiceDTO>> getServicesById(@RequestParam("ids") Set<Long> id);

}
