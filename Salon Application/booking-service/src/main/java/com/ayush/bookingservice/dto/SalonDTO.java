package com.ayush.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
