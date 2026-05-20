package com.ayush.salonservice.controller;

import com.ayush.salonservice.model.Salon;
import com.ayush.salonservice.dto.SalonDTO;
import com.ayush.salonservice.dto.UserDTO;
import com.ayush.salonservice.service.SalonService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/salons")
@RequiredArgsConstructor
public class SalonController {

    private final SalonService salonService;
    private final ModelMapper modelMapper;

    @PostMapping("")
    public ResponseEntity<SalonDTO> createSalon(@RequestBody SalonDTO salonDTO) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        Salon salon = salonService.createSalon(salonDTO, userDTO);
        SalonDTO result = modelMapper.map(salon, SalonDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonDTO> updateSalon(@PathVariable Long id, @RequestBody SalonDTO salonDTO)throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        Salon salon = salonService.updateSalon(salonDTO, userDTO,id);
        SalonDTO result = modelMapper.map(salon, SalonDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping()
    public ResponseEntity<List<SalonDTO>> getAllSalons() {
        List<Salon> salons = salonService.getAllSalons();
        List<SalonDTO> result = salons.stream().map((salon -> {
            return modelMapper.map(salon, SalonDTO.class);
        })).toList();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonDTO> getSalonById(@PathVariable Long id) {
        Salon salon = salonService.getSalonById(id);
        SalonDTO result = modelMapper.map(salon, SalonDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalonDTO>> searchSalon(@RequestParam("city") String city) {
        List<Salon> salons = salonService.searchSalonByCity(city);
        List<SalonDTO> result = salons.stream().map((salon ->  {
            return modelMapper.map(salon, SalonDTO.class);
        })).toList();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<SalonDTO>> getAllSalonByOwnerId() {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        List<Salon> salon = salonService.getSalonByOwnerId(userDTO.getId());
        List<SalonDTO> result = salon.stream().map((salon1->{
            return modelMapper.map(salon1, SalonDTO.class);
        })).toList();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
