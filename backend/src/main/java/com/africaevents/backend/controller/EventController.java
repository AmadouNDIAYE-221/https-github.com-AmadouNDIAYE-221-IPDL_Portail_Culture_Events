package com.africaevents.backend.controller;

import com.africaevents.backend.dto.EventDTO;
import com.africaevents.backend.entity.Event;
import com.africaevents.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO) {
        Event event = eventDTO.toEntity();
        Event createdEvent = eventService.saveEvent(event);
        return new ResponseEntity<>(EventDTO.fromEntity(createdEvent), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<EventDTO> eventDTOs = events.stream()
            .map(EventDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(EventDTO.fromEntity(event));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<EventDTO>> getEventsByLocation(@PathVariable String location) {
        List<Event> events = eventService.getEventsByLocation(location);
        List<EventDTO> eventDTOs = events.stream()
            .map(EventDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        Event event = eventDTO.toEntity();
        event.setId(id);  // Assurez-vous que l'ID est correctement défini
        Event updatedEvent = eventService.updateEvent(id, event);
        return ResponseEntity.ok(EventDTO.fromEntity(updatedEvent));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<EventDTO>> getOrganizerEvents() {
        List<Event> events = eventService.getEventsByCurrentOrganizer();
        List<EventDTO> eventDTOs = events.stream()
            .map(EventDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }
}