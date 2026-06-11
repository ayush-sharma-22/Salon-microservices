package com.ayush.salonservice.controller;

import com.ayush.salonservice.model.Salon;
import com.ayush.salonservice.dto.SalonDTO;
import com.ayush.salonservice.dto.UserDTO;
import com.ayush.salonservice.service.SalonService;
import com.ayush.salonservice.service.client.UserFeignClient;
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
    private final UserFeignClient userFeignClient;

    @PostMapping("")
    public ResponseEntity<SalonDTO> createSalon(@RequestBody SalonDTO salonDTO, @RequestHeader("Authorization") String jwt) {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        Salon salon = salonService.createSalon(salonDTO, userDTO);
        SalonDTO result = modelMapper.map(salon, SalonDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonDTO> updateSalon(@PathVariable Long id, @RequestBody SalonDTO salonDTO, @RequestHeader("Authorization") String jwt)throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
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
        if (salon == null) {
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
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
    public ResponseEntity<SalonDTO> getSalonByOwnerId(@RequestHeader("Authorization") String jwt) {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        Salon salon = salonService.getSalonByOwnerId(userDTO.getId());
        if (salon == null) {
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        SalonDTO result = modelMapper.map(salon, SalonDTO.class);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}