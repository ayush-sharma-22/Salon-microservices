package com.ayush.notificationservice.service;

import com.ayush.notificationservice.dto.NotificationDTO;
import com.ayush.notificationservice.model.Notification;

import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(Notification notification);

    List<Notification> getAllNotificationByUserId(Long userId);

    List<Notification> getAllNotificationBySalonId(Long salonId);

    Notification markNotificationAsRead(Long notificationId);
}
