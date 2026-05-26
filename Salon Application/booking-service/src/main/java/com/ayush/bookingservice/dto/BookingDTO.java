package com.ayush.bookingservice.dto;

import com.ayush.bookingservice.enums.BookingStatus;
import jakarta.persistence.ElementCollection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    private Double totalPrice;
}
