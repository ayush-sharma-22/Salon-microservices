package com.ayush.service_offering.repository;

import com.ayush.service_offering.model.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Set;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    Set<ServiceOffering> findBySalonId(Long id);
}
