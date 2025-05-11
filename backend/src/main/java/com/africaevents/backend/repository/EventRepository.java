package com.africaevents.backend.repository;

import com.africaevents.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByLocationContainingIgnoreCase(String location);
}