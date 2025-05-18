package com.africaevents.backend.service;

import com.africaevents.backend.dto.ReservationRequest;
import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.Reservation;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.exception.BadRequestException;
import com.africaevents.backend.exception.ResourceNotFoundException;
import com.africaevents.backend.repository.EventRepository;
import com.africaevents.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final UserService userService;

    public ReservationService(ReservationRepository reservationRepository, 
                            EventRepository eventRepository, 
                            UserService userService) {
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.userService = userService;
    }

    @Transactional
    public Reservation createReservation(ReservationRequest request, Long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userService.getUserByEmail(userEmail);
        
        // Vérifier la capacité disponible
        int totalReservations = findByEvent(eventId).stream()
                .filter(r -> !"CANCELLED".equals(r.getStatus()))
                .mapToInt(Reservation::getNumberOfTickets)
                .sum();
                
        if (totalReservations + request.getNumberOfTickets() > event.getCapacity()) {
            throw new BadRequestException("Not enough tickets available for this event");
        }
        
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setEvent(event);
        reservation.setNumberOfTickets(request.getNumberOfTickets());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("CONFIRMED");
        
        return reservationRepository.save(reservation);
    }
    
    public List<Reservation> findByUser(String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return reservationRepository.findByUser(user);
    }
    
    public List<Reservation> findByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return reservationRepository.findByEvent(event);
    }

    
    public List<Reservation> findByEvent(Long eventId, boolean checkOrganizer, String userEmail) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
    if (checkOrganizer) {
        User user = userService.getUserByEmail(userEmail);
        if (!"ORGANIZER".equals(user.getRole()) || 
            (event.getOrganizer() != null && !event.getOrganizer().getId().equals(user.getId()))) {
            throw new BadRequestException("Only the event organizer can access these reservations");
        }
    }
    
    return reservationRepository.findByEvent(event);
}

    
    
    @Transactional
    public void cancelReservation(Long id, String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
                
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only cancel your own reservations");
        }
        
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }
}
