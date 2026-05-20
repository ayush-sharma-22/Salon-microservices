package com.ayush.salonservice.service;

import com.ayush.salonservice.model.Salon;
import com.ayush.salonservice.dto.SalonDTO;
import com.ayush.salonservice.dto.UserDTO;
import com.ayush.salonservice.repository.SalonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SalonServiceImpl implements SalonService {

    private final SalonRepository salonRepository;

    @Override
    public Salon createSalon(SalonDTO salon, UserDTO user) {
        Salon sal = new Salon();
        sal.setName(salon.getName());
        sal.setEmail(salon.getEmail());
        sal.setAddress(salon.getAddress());
        sal.setCity(salon.getCity());
        sal.setImages(salon.getImages());
        sal.setOpeningTime(salon.getOpeningTime());
        sal.setClosingTime(salon.getClosingTime());
        sal.setPhoneNumber(salon.getPhoneNumber());
        sal.setOwnerId(user.getId());

        return salonRepository.save(sal);
    }

    @Override
    public Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception {
        Salon exisitingSalon = salonRepository.findById(salonId).orElse(null);
        if (exisitingSalon != null && salon.getOwnerId().equals(user.getId())) {
            exisitingSalon.setName(salon.getName());
            exisitingSalon.setEmail(salon.getEmail());
            exisitingSalon.setAddress(salon.getAddress());
            exisitingSalon.setCity(salon.getCity());
            exisitingSalon.setImages(salon.getImages());
            exisitingSalon.setOpeningTime(salon.getOpeningTime());
            exisitingSalon.setClosingTime(salon.getClosingTime());
            exisitingSalon.setPhoneNumber(salon.getPhoneNumber());
            exisitingSalon.setOwnerId(user.getId());

            return salonRepository.save(exisitingSalon);
        }
        throw new Exception("Salon not found");
    }

    @Override
    public List<Salon> getAllSalons() {
        return salonRepository.findAll();
    }

    @Override
    public Salon getSalonById(Long salonId) {
        return salonRepository.findById(salonId).orElse(null);
    }

    @Override
    public List<Salon> getSalonByOwnerId(Long ownerId) {
        List<Salon> exisitingSalon = salonRepository.findByOwnerId(ownerId);
        return exisitingSalon;
    }

    @Override
    public List<Salon> searchSalonByCity(String city) {
        return salonRepository.SearchSalons(city);
    }
}
