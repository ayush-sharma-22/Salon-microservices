package com.ayush.notificationservice.mapper;

import com.ayush.notificationservice.dto.BookingDTO;
import com.ayush.notificationservice.dto.NotificationDTO;
import com.ayush.notificationservice.model.Notification;


public class NotificationMapper {

    public static NotificationDTO toDTO(Notification notification, BookingDTO bookingDTO) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setDescription(notification.getDescription());
        dto.setUserId(notification.getUserId());
        dto.setSalonId(notification.getSalonId());
        dto.setBookingId(notification.getBookingId());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());

        // ← enriching with booking details
        dto.setBookingDTO(bookingDTO);

        return dto;
    }
}