package com.ayush.salonservice.service;

import com.ayush.salonservice.model.Salon;
import com.ayush.salonservice.dto.SalonDTO;
import com.ayush.salonservice.dto.UserDTO;

import java.util.List;

public interface SalonService {
    Salon createSalon(SalonDTO salon, UserDTO user);

    Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception;

    List<Salon> getAllSalons();

    Salon getSalonById(Long salonId);

    List<Salon> getSalonByOwnerId(Long ownerId);

    List<Salon> searchSalonByCity(String city);
}
