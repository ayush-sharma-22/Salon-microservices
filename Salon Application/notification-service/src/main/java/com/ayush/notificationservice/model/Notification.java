package com.ayush.notificationservice.model;

import com.ayush.notificationservice.dto.BookingDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private boolean isRead = false;

    private String description;


    private Long userId;

    private Long salonId;

    private Long bookingId;

    private LocalDateTime createdAt;

//    private BookingDTO bookingDTO;
}
