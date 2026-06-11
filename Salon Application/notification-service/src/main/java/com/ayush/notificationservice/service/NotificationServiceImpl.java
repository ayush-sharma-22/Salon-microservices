package com.ayush.notificationservice.service;

import com.ayush.notificationservice.dto.BookingDTO;
import com.ayush.notificationservice.dto.NotificationDTO;
import com.ayush.notificationservice.model.Notification;
import com.ayush.notificationservice.repository.NotificationRepository;
import com.ayush.notificationservice.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final BookingFeignClient bookingFeignClient;
    private final ModelMapper modelMapper;

    @Override
    public NotificationDTO createNotification(Notification notification) {

        Notification savedNotification = notificationRepository.save(notification);

        BookingDTO bookingDTO =
                bookingFeignClient.getBookingById(savedNotification.getBookingId()).getBody();

        return modelMapper.map(notification, NotificationDTO.class);
    }

    @Override
    public List<Notification> getAllNotificationByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getAllNotificationBySalonId(Long salonId) {
        return notificationRepository.findBySalonId(salonId);
    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) {
        return notificationRepository.findById(notificationId).map(
                notification -> {
                    notification.setRead(true);
                    return notificationRepository.save(notification);
                }
        ).orElseThrow(()->new RuntimeException("Notification not found"));
    }
}
