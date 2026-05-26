package com.ayush.bookingservice.services;

import com.ayush.bookingservice.dto.*;
import com.ayush.bookingservice.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BookingService {
    BookingDTO createBooking(BookingDTO bookingDTO, UserDTO userDTO, SalonDTO salonDTO, Set<ServiceDTO> services) throws Exception;

    List<BookingDTO> getBookingsByCustomerId(Long customerId);
    List<BookingDTO> getBookingsBySalonId(Long salonId);

    BookingDTO getBookingById(Long id);

    BookingDTO updateBooking(BookingStatus status, Long id);

    List<BookingDTO> getBookingsByDate(LocalDate date, Long salonId);

    SalonReport getSalonReport(Long salonId);
}
