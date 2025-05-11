package com.africaevents.backend.service;

import com.africaevents.backend.dto.ReservationRequest;
import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.Reservation;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.exception.BadRequestException;
import com.africaevents.backend.exception.ResourceNotFoundException;
import com.africaevents.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserService userService;
    private final EventService eventService;

    public ReservationService(ReservationRepository reservationRepository, UserService userService, EventService eventService) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.eventService = eventService;
    }

    public Reservation createReservation(ReservationRequest request, Long eventId, String userEmail) {
        User user = userService.loadUserByUsername(userEmail);
        Event event = eventService.findById(eventId);

        int reservedSeats = reservationRepository.findByEvent(event).stream()
            .mapToInt(Reservation::getNumberOfTickets)
            .sum();

        if (reservedSeats + request.getNumberOfTickets() > event.getCapacity()) {
            throw new BadRequestException("Not enough seats available");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setEvent(event);
        reservation.setNumberOfTickets(request.getNumberOfTickets());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("CONFIRMED");

        return reservationRepository.save(reservation);
    }

    public List<Reservation> findByUser(String email) {
        User user = userService.loadUserByUsername(email);
        return reservationRepository.findByUser(user);
    }

    public List<Reservation> findByEvent(Long eventId) {
        Event event = eventService.findById(eventId);
        return reservationRepository.findByEvent(event);
    }

    public void cancelReservation(Long id, String userEmail) {
        User user = userService.loadUserByUsername(userEmail);
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only cancel your own reservations");
        }

        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }
}
