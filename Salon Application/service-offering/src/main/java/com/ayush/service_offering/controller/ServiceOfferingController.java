package com.ayush.service_offering.controller;

import com.ayush.service_offering.dto.CategoryDTO;
import com.ayush.service_offering.dto.SalonDTO;
import com.ayush.service_offering.dto.ServiceDTO;
import com.ayush.service_offering.model.ServiceOffering;
import com.ayush.service_offering.service.ServiceOfferingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/services")
public class ServiceOfferingController {
    private final ServiceOfferingService serviceOfferingService;

    @PostMapping
    public ResponseEntity<ServiceDTO> createServices(@Valid @RequestBody ServiceDTO serviceDTO) {
        CategoryDTO categoryDTO = new CategoryDTO();
        SalonDTO salonDTO = new SalonDTO();
        categoryDTO.setId(1L);
        salonDTO.setId(1L);
        ServiceDTO result = serviceOfferingService.createServices(serviceDTO, categoryDTO, salonDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceDTO> updateServices(@PathVariable Long id,
                                                     @Valid@RequestBody ServiceDTO serviceDTO) {
        ServiceDTO result = serviceOfferingService.updateService(id, serviceDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Set<ServiceDTO>> getServicesBySalonId(@PathVariable Long id, @RequestParam(required = false) Long categoryId) {
        Set<ServiceDTO> result = serviceOfferingService.getServiceBySalonId(id, categoryId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<Set<ServiceDTO>> getServicesById(@RequestParam("ids") Set<Long> id) {
        Set<ServiceDTO> result = serviceOfferingService.getServiceByIds(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
