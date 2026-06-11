package com.ayush.service_offering.controller;

import com.ayush.service_offering.dto.CategoryDTO;
import com.ayush.service_offering.dto.SalonDTO;
import com.ayush.service_offering.dto.ServiceDTO;
import com.ayush.service_offering.service.ServiceOfferingService;
import com.ayush.service_offering.service.client.CategoryFeignClient;
import com.ayush.service_offering.service.client.SalonFeignClient;
import com.ayush.service_offering.service.client.UserFeignClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/service-offering")
public class ServiceOfferingController {
    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonFeignClient;
    private final CategoryFeignClient categoryFeignClient;
    private final UserFeignClient userFeignClient;

    @PostMapping("/salon-owner")
    public ResponseEntity<ServiceDTO> createServices(@Valid @RequestBody ServiceDTO serviceDTO, @RequestHeader("Authorization") String jwt) {
        CategoryDTO categoryDTO = categoryFeignClient.getCategoryById(serviceDTO.getCategoryId()).getBody();
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        ServiceDTO result = serviceOfferingService.createServices(serviceDTO, categoryDTO, salonDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/salon-owner/{id}")
    public ResponseEntity<ServiceDTO> updateServices(@PathVariable Long id,
                                                     @Valid @RequestBody ServiceDTO serviceDTO) {
        ServiceDTO result = serviceOfferingService.updateService(id, serviceDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/salon/{id}")
    public ResponseEntity<Set<ServiceDTO>> getServicesBySalonId(@PathVariable Long id, @RequestParam(required = false) Long categoryId) {
        Set<ServiceDTO> result = serviceOfferingService.getServiceBySalonId(id, categoryId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<Set<ServiceDTO>> getServicesById(@RequestParam("ids") Set<Long> id) {
        Set<ServiceDTO> result = serviceOfferingService.getServiceByIds(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        ServiceDTO result = serviceOfferingService.getServiceById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
