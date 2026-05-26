package com.ayush.bookingservice.services;

import com.ayush.bookingservice.dto.*;
import com.ayush.bookingservice.enums.BookingStatus;
import com.ayush.bookingservice.exception.ResourceNotFoundException;
import com.ayush.bookingservice.model.Booking;
import com.ayush.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements  BookingService {

    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    @Override
    public BookingDTO createBooking(BookingDTO bookingDTO,
                                    UserDTO userDTO,
                                    SalonDTO salonDTO,
                                    Set<ServiceDTO> services) throws Exception {

        int totalDuration = services.stream().mapToInt(ServiceDTO::getDuration).sum();
        LocalDateTime bookingStartTime = bookingDTO.getStartTime();
        LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);

        boolean isSlotAvailable = isTimeSlotAvailable(salonDTO,bookingStartTime,bookingEndTime);

        double totalPrice = services.stream().mapToDouble(ServiceDTO::getPrice).sum();
        Set<Long> ids = services.stream().map(ServiceDTO::getId).collect(Collectors.toSet());

        Booking booking = new Booking();
        booking.setCustomerId(userDTO.getId());
        booking.setSalonId(salonDTO.getId());
        booking.setStartTime(bookingStartTime);
        booking.setEndTime(bookingEndTime);
        booking.setServiceIds(ids);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);

        bookingRepository.save(booking);
        return modelMapper.map(booking, BookingDTO.class);
    }


    @Override
    public List<BookingDTO> getBookingsByCustomerId(Long customerId) {
        List<Booking> existingBooking = bookingRepository.findByCustomerId(customerId);
        return existingBooking.stream().map(booking ->
                modelMapper.map(booking, BookingDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getBookingsBySalonId(Long salonId) {

        List<Booking> existingBooking = bookingRepository.findBySalonId(salonId);
        return existingBooking.stream().map(booking ->
                modelMapper.map(booking, BookingDTO.class)).collect(Collectors.toList());
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("No booking found with id: "+id));

        return modelMapper.map(booking, BookingDTO.class);
    }

    @Override
    public BookingDTO updateBooking(BookingStatus status, Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("No booking found with id: "+id));
        booking.setStatus(status);
        bookingRepository.save(booking);
        return modelMapper.map(booking, BookingDTO.class);
    }

    @Override
    public List<BookingDTO> getBookingsByDate(LocalDate date, Long salonId) {
        List<Booking> AllBookings = bookingRepository.findBySalonId(salonId);

        if(date == null){
            return AllBookings.stream().map(booking ->
                    modelMapper.map(booking, BookingDTO.class)).collect(Collectors.toList());
        }
        List<Booking> filteredBookings = AllBookings.stream().filter(booking -> isSameDate(booking.getStartTime(), date)
                                        ||  isSameDate(booking.getEndTime(), date)).toList();

        return filteredBookings.stream().map(booking ->
                modelMapper.map(booking, BookingDTO.class)).collect(Collectors.toList());

    }


    @Override
    public SalonReport getSalonReport(Long salonId) {
        List<Booking> bookings = bookingRepository.findBySalonId(salonId);

        Double totalEarnings = bookings.stream().mapToDouble(Booking::getTotalPrice).sum();
        Integer totalBooking =  bookings.size();

        List<Booking> cancelledBookings = bookings.stream().filter(booking ->
                                            booking.getStatus() == BookingStatus.CANCELLED).toList();

        Double totalRefunds = cancelledBookings.stream().mapToDouble(Booking::getTotalPrice).sum();

        SalonReport salonReport = new SalonReport();
        salonReport.setTotalEarnings(totalEarnings);
        salonReport.setTotalBookings(totalBooking);
        salonReport.setSalonId(salonId);
        salonReport.setCancelBookings(cancelledBookings.size());
        salonReport.setTotalRefund(totalRefunds);

        return salonReport;
    }



    public boolean isTimeSlotAvailable(SalonDTO salonDTO,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) throws Exception {
        List<BookingDTO> existingBookings = getBookingsBySalonId(salonDTO.getId());
        LocalDateTime salonOpenTime = salonDTO.getOpeningTime().atDate(bookingStartTime.toLocalDate());
        LocalDateTime salonCloseTime = salonDTO.getClosingTime().atDate(bookingEndTime.toLocalDate());

        if(bookingStartTime.isBefore(salonOpenTime) || bookingEndTime.isAfter(salonCloseTime)){
            throw new Exception("Booking time must be withing working hours");
        }

        for(BookingDTO existingBooking : existingBookings){
            LocalDateTime existingBookingStartTime = existingBooking.getStartTime();
            LocalDateTime existingBookingEndTime = existingBooking.getEndTime();

            if(bookingStartTime.isBefore(existingBookingEndTime) &&
                    bookingEndTime.isAfter(existingBookingStartTime)){
                throw new Exception("Slot not available, choose different start and end time");
            }

            if(bookingStartTime.isEqual(existingBookingStartTime) || bookingEndTime.isEqual(existingBookingEndTime)){
                throw new Exception("Slot not available, choose different start and end time");
            }
        }
        return true;
    }


    private boolean isSameDate(LocalDateTime dateTime, LocalDate date) {
        return dateTime.toLocalDate().isEqual(date);
    }
}
