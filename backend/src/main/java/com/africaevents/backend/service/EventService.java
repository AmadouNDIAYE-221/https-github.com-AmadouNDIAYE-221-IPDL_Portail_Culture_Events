package com.africaevents.backend.service;

import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;

    @Autowired
    public EventService(EventRepository eventRepository, UserService userService) {
        this.eventRepository = eventRepository;
        this.userService = userService;
    }

    public Event saveEvent(Event event) {
        User organizer = userService.getCurrentUser();
        if (!organizer.getRole().equals("ORGANIZER")) {
            throw new RuntimeException("Only organizers can create events");
        }
        event.setOrganizer(organizer);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<Event> getEventsByLocation(String location) {
        return eventRepository.findByLocation(location);
    }
}
