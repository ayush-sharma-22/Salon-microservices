package com.ayush.service_offering.service;

import com.ayush.service_offering.dto.CategoryDTO;
import com.ayush.service_offering.dto.SalonDTO;
import com.ayush.service_offering.dto.ServiceDTO;
import com.ayush.service_offering.exceptions.APIException;
import com.ayush.service_offering.exceptions.ResourceNotFoundException;
import com.ayush.service_offering.model.ServiceOffering;
import com.ayush.service_offering.repository.ServiceOfferingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final ModelMapper modelMapper;

    @Override
    public ServiceDTO createServices(ServiceDTO serviceDTO,
                                     CategoryDTO categoryDTO,
                                     SalonDTO salonDTO) {
        if(categoryDTO.getId() == null){
            throw new ResourceNotFoundException("Category not found");
        }

        if(salonDTO.getId() == null){
            throw new ResourceNotFoundException("Salon not found");
        }

        if(serviceOfferingRepository
                .existsByNameAndSalonId(
                        serviceDTO.getName(),
                        salonDTO.getId())) {

            throw new APIException(
                    "Service already exists in this salon"
            );
        }

        validateService(serviceDTO);

        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setCategoryId(categoryDTO.getId());
        serviceOffering.setSalonId(salonDTO.getId());
        serviceOffering.setName(serviceDTO.getName());
        serviceOffering.setDescription(serviceDTO.getDescription());
        serviceOffering.setPrice(serviceDTO.getPrice());
        serviceOffering.setDuration(serviceDTO.getDuration());
        serviceOffering.setImages(serviceDTO.getImages());

        ServiceOffering result = serviceOfferingRepository.save(serviceOffering);
        return modelMapper.map(result, ServiceDTO.class);
    }

    @Override
    public ServiceDTO updateService(Long id, ServiceDTO serviceDTO) {
        ServiceOffering existingServiceOffering = serviceOfferingRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("No service found with id: " + id));

        validateService(serviceDTO);

        existingServiceOffering.setName(serviceDTO.getName());
        existingServiceOffering.setDescription(serviceDTO.getDescription());
        existingServiceOffering.setPrice(serviceDTO.getPrice());
        existingServiceOffering.setDuration(serviceDTO.getDuration());
        existingServiceOffering.setImages(serviceDTO.getImages());

        ServiceOffering result = serviceOfferingRepository.save(existingServiceOffering);
        return modelMapper.map(result, ServiceDTO.class);
    }

    @Override
    public Set<ServiceDTO> getServiceBySalonId(Long id, Long categoryId) {
        Set<ServiceOffering> serviceOfferings = serviceOfferingRepository.findBySalonId(id);

        if(categoryId!=null){
            serviceOfferings = serviceOfferings.stream().filter((serviceOffering) ->
                serviceOffering.getCategoryId() != null && serviceOffering.getCategoryId().equals(categoryId)
            ).collect(Collectors.toSet());
        }
        return serviceOfferings.stream().map(serviceOffering ->
                modelMapper.map(serviceOffering, ServiceDTO.class)).collect(Collectors.toSet());
    }

    @Override
    public Set<ServiceDTO> getServiceByIds(Set<Long> id) {
        Set<ServiceOffering> services =
                new HashSet<>(serviceOfferingRepository.findAllById(id));
        return services.stream().map(serviceOffering ->
                modelMapper.map(serviceOffering, ServiceDTO.class)).collect(Collectors.toSet());
    }

    @Override
    public ServiceDTO getServiceById(Long id){
        ServiceOffering service = serviceOfferingRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No Service by id:"+id));
        return modelMapper.map(service, ServiceDTO.class);
    }


    private void validateService(ServiceDTO serviceDTO){

        if(serviceDTO.getName() == null ||
                serviceDTO.getName().isBlank()){

            throw new APIException(
                    "Service name is required");
        }

        if(serviceDTO.getDescription() == null ||
                serviceDTO.getDescription().isBlank()){

            throw new APIException(
                    "Description is required");
        }

        if(serviceDTO.getPrice() == null ||
                serviceDTO.getPrice() <= 0){

            throw new APIException(
                    "Price must be greater than 0");
        }

        if(serviceDTO.getDuration() == null ||
                serviceDTO.getDuration() <= 0){

            throw new APIException(
                    "Duration must be greater than 0");
        }
    }
}
