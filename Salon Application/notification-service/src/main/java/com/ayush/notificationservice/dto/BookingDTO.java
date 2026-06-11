package com.ayush.notificationservice.dto;


import com.ayush.notificationservice.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Set<Long> serviceIds;

    private BookingStatus status = BookingStatus.PENDING;

    private Integer totalPrice;

    private Long salonId;
}
