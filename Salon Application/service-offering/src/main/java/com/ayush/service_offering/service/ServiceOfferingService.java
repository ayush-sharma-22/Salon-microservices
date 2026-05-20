package com.ayush.service_offering.service;

import com.ayush.service_offering.dto.CategoryDTO;
import com.ayush.service_offering.dto.SalonDTO;
import com.ayush.service_offering.dto.ServiceDTO;

import java.util.Set;

public interface ServiceOfferingService {
    ServiceDTO createServices(ServiceDTO serviceDTO, CategoryDTO categoryDTO, SalonDTO salonDTO);

    ServiceDTO updateService(Long id, ServiceDTO serviceDTO);

    Set<ServiceDTO> getServiceBySalonId(Long id, Long categoryId);

    Set<ServiceDTO> getServiceByIds(Set<Long> ids);
}
