package com.ayush.notificationservice.controller;

import com.ayush.notificationservice.dto.BookingDTO;
import com.ayush.notificationservice.dto.NotificationDTO;
import com.ayush.notificationservice.mapper.NotificationMapper;
import com.ayush.notificationservice.model.Notification;
import com.ayush.notificationservice.service.NotificationService;
import com.ayush.notificationservice.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final BookingFeignClient bookingFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification) {
        NotificationDTO result = notificationService.createNotification(notification);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUserId(
            @PathVariable Long userId) {
        List<Notification> notifications = notificationService.getAllNotificationByUserId(userId);

        List<NotificationDTO> notificationDTOS =
                notifications.stream().map(
                        notification -> {
                            BookingDTO bookingDTO =null;
                            try{
                                bookingDTO = bookingFeignClient.getBookingById(notification.getBookingId()).getBody();
                            }catch (Exception e){
                                throw new RuntimeException(e);
                            }
                            return NotificationMapper.toDTO(notification, bookingDTO);
                        }
                ).toList();
        return ResponseEntity.ok(notificationDTOS);

    }

    @GetMapping("/salon-owner/salon/{salonId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsBySalonId(
            @PathVariable Long salonId) {

        List<Notification> notifications = notificationService.getAllNotificationBySalonId(salonId);

        List<NotificationDTO> notificationDTOS = notifications.stream().map(
                notification -> {
                    BookingDTO bookingDTO = null;
                    try {
                        bookingDTO = bookingFeignClient.getBookingById(notification.getBookingId()).getBody();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return NotificationMapper.toDTO(notification, bookingDTO);
                }
        ).toList();

        return ResponseEntity.ok(notificationDTOS);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId) {
        Notification result = notificationService.markNotificationAsRead(notificationId);

        BookingDTO bookingDTO = bookingFeignClient.getBookingById(result.getBookingId()).getBody();

        return new ResponseEntity<>(
                NotificationMapper.toDTO(result, bookingDTO),
                HttpStatus.OK
        );
    }
}