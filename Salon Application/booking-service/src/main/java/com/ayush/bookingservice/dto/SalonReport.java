package com.ayush.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalonReport {
    private Long salonId;

    private String salonName;

    private Double totalEarnings;

    private Integer totalBookings;

    private Integer cancelBookings;

    private Double totalRefund;
}
