package com.ayush.bookingservice.controller;

import com.ayush.bookingservice.dto.*;
import com.ayush.bookingservice.enums.BookingStatus;
import com.ayush.bookingservice.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;


    @PostMapping
    ResponseEntity<BookingDTO> createBooking(@RequestParam("salonId") Long salonId,
                                             @RequestBody BookingDTO bookingDTO) throws Exception {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(salonId);
        salonDTO.setOpeningTime(LocalTime.now());
        salonDTO.setClosingTime(LocalTime.now().plusHours(12));

        Set<ServiceDTO> serviceDTOS = new HashSet<>();
        ServiceDTO serviceDTO = new ServiceDTO();

        serviceDTO.setId(1L);
        serviceDTO.setPrice(399D);
        serviceDTO.setDuration(45);
        serviceDTO.setName("Hair-Cut for men");

        serviceDTOS.add(serviceDTO);

        BookingDTO result = bookingService.createBooking(bookingDTO, userDTO, salonDTO,serviceDTOS);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/customer")
    ResponseEntity<List<BookingDTO>> getBookingsByCustomerId(){

        List<BookingDTO> result = bookingService.getBookingsByCustomerId(1L);
        return ResponseEntity.ok().body(result);
    };

    @GetMapping("/salon")
    ResponseEntity<List<BookingDTO>> getBookingsBySalonId(){
        List<BookingDTO> result = bookingService.getBookingsBySalonId(1L);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/{id}")
    ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id){
        BookingDTO result = bookingService.getBookingById(id);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/{id}")
    ResponseEntity<BookingDTO> updateBooking(@PathVariable Long id, @RequestParam BookingStatus status){
        BookingDTO result = bookingService.updateBooking(status,id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("slots/salon/{salonId}/date")
    ResponseEntity<List<BookingSlotDTO>> getBookedSlots(@PathVariable Long salonId, @RequestParam(required = false) LocalDate date){
        List<BookingDTO> result = bookingService.getBookingsByDate(date ,salonId);

        List<BookingSlotDTO> slots = result.stream().map(res->{
            BookingSlotDTO slotDTO = new BookingSlotDTO();
            slotDTO.setStartTime(res.getStartTime());
            slotDTO.setEndTime(res.getEndTime());
            return slotDTO;
        }).toList();

        return ResponseEntity.ok().body(slots);
    }

    @GetMapping("/report")
    ResponseEntity<SalonReport> getBookingReport(){
        SalonReport result = bookingService.getSalonReport(1L);


        return ResponseEntity.ok().body(result);
    }


}
