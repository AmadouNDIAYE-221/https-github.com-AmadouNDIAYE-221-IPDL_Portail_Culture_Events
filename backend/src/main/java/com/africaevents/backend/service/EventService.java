package com.africaevents.backend.service;

import com.africaevents.backend.dto.EventRequest;
import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.exception.BadRequestException;
import com.africaevents.backend.exception.ResourceNotFoundException;
import com.africaevents.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;

    public EventService(EventRepository eventRepository, UserService userService) {
        this.eventRepository = eventRepository;
        this.userService = userService;
    }

    public Event createEvent(EventRequest request, Long organizerId) {
        User organizer = userService.findById(organizerId);
        if (!organizer.getRole().equals("ORGANIZER")) {
            throw new BadRequestException("Only organizers can create events");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCapacity(request.getCapacity());
        event.setPrice(request.getPrice());
        event.setCategory(request.getCategory());
        event.setGallery(request.getGallery());
        event.setOrganizer(organizer);

        return eventRepository.save(event);
    }

    public Event findById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public List<Event> findByLocation(String location) {
        return eventRepository.findByLocationContainingIgnoreCase(location);
    }
}
