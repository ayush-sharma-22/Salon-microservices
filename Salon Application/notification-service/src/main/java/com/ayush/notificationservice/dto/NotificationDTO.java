package com.ayush.notificationservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {

    private Long id;

    private String type;

    private boolean isRead = false;

    private String description;

    private Long userId;

    private Long salonId;

    private Long bookingId;

    private LocalDateTime createdAt;

    private BookingDTO bookingDTO;
}
