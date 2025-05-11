package com.africaevents.backend.repository;

import com.africaevents.backend.entity.Reservation;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);
    List<Reservation> findByEvent(Event event);
}