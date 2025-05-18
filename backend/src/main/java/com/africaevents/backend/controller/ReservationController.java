// Correction 4 : Controller de Réservation mis à jour pour correspondre aux endpoints attendus
package com.africaevents.backend.controller;

import com.africaevents.backend.dto.ReservationRequest;
import com.africaevents.backend.entity.Reservation;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Reservation> createReservation(
            @Valid @RequestBody ReservationRequest request,
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user) {
        Reservation reservation = reservationService.createReservation(request, eventId, user.getEmail());
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Reservation>> getUserReservations(@AuthenticationPrincipal User user) {
        List<Reservation> reservations = reservationService.findByUser(user.getEmail());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Reservation>> getEventReservations(@PathVariable Long eventId) {
        List<Reservation> reservations = reservationService.findByEvent(eventId);
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id, @AuthenticationPrincipal User user) {
        reservationService.cancelReservation(id, user.getEmail());
        return ResponseEntity.noContent().build();
    }
}
