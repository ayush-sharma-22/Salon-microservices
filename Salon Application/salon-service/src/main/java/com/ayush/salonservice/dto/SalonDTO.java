package com.ayush.salonservice.dto;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class SalonDTO {

    private Long id;
    private String name;
    private List<String> images;
    private String address;
    private String city;
    private String phoneNumber;
    private String email;
    private Long ownerId;
    private LocalTime openingTime;
    private LocalTime closingTime;
}
