package com.africaevents.backend.service;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.EventStatus;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.repository.DestinationRepository;
import com.africaevents.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;
    private final DestinationRepository destinationRepository;

    @Autowired
    public EventService(EventRepository eventRepository, UserService userService, DestinationRepository destinationRepository) {
        this.eventRepository = eventRepository;
        this.userService = userService;
        this.destinationRepository = destinationRepository;
    }

    public Event saveEvent(Event event) {
        // Vérifier l'autorisation de l'organisateur
        User organizer = userService.getCurrentUser();
        if (!organizer.getRole().equals("ORGANIZER")) {
            throw new RuntimeException("Only organizers can create events");
        }
        event.setOrganizer(organizer);
        
        // Si un ID de destination est fourni, récupérer la destination
        // Vérifier si destination est déjà définie ou si c'est juste un ID
        if (event.getDestination() != null && event.getDestination().getId() != null) {
            final Long destinationId = event.getDestination().getId();
            Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found with ID: " + destinationId));
            event.setDestination(destination);
            
            // Utiliser le nom de la destination comme valeur pour le champ 'location'
            // pour satisfaire la contrainte NOT NULL dans la base de données
            if (event.getLocation() == null) {
                event.setLocation(destination.getName());
            }
        }
        
        // Vérifier si location est toujours null après tout
        if (event.getLocation() == null) {
            throw new RuntimeException("Le champ 'location' ne peut pas être vide");
        }
        
        // Initialiser availableCapacity avec la même valeur que capacity si non défini
        if (event.getAvailableCapacity() == 0) {
            event.setAvailableCapacity(event.getCapacity());
        }
        
        // Initialiser totalCapacity avec la valeur de capacity si non défini
        if (event.getTotalCapacity() == 0) {
            event.setTotalCapacity(event.getCapacity());
        }
        
        // Initialiser les dates de début et de fin si non définies
        if (event.getStartDate() == null) {
            // Si la date est définie, l'utiliser pour construire le startDate
            if (event.getDate() != null) {
                // Si l'heure est définie, l'utiliser, sinon utiliser minuit
                if (event.getTime() != null) {
                    event.setStartDate(LocalDateTime.of(event.getDate(), event.getTime()));
                } else {
                    event.setStartDate(LocalDateTime.of(event.getDate(), LocalTime.MIDNIGHT));
                }
            } else {
                // Si aucune date n'est définie, utiliser la date actuelle
                event.setStartDate(LocalDateTime.now());
            }
        }
        
        // Initialiser la date de fin (par défaut 2 heures après le début)
        if (event.getEndDate() == null) {
            event.setEndDate(event.getStartDate().plusHours(2));
        }
        
        // Définir le statut par défaut (UPCOMING pour un nouveau événement)
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.UPCOMING);
        }
        
        // Sauvegarder l'événement
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
    
    /**
     * Récupère tous les événements créés par l'organisateur actuellement connecté
     * @return Liste des événements de l'organisateur
     */
    public List<Event> getEventsByCurrentOrganizer() {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getRole().equals("ORGANIZER")) {
            throw new RuntimeException("Seuls les organisateurs peuvent accéder à leurs événements");
        }
        return eventRepository.findByOrganizer(currentUser);
    }
    
    public Event updateEvent(Long id, Event updatedEvent) {
        // Vérifier si l'événement existe
        Event existingEvent = getEventById(id);
        
        // Vérifier que l'utilisateur actuel est bien l'organisateur de l'événement
        User currentUser = userService.getCurrentUser();
        if (!existingEvent.getOrganizer().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ADMIN")) {
            throw new RuntimeException("You are not authorized to update this event");
        }
        
        // Mettre à jour les champs modifiables
        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setDate(updatedEvent.getDate());
        existingEvent.setTime(updatedEvent.getTime());
        existingEvent.setCategory(updatedEvent.getCategory());
        existingEvent.setCapacity(updatedEvent.getCapacity());
        existingEvent.setPrice(updatedEvent.getPrice());
        existingEvent.setImageUrl(updatedEvent.getImageUrl());
        
        // Mettre à jour la destination si elle est modifiée
        if (updatedEvent.getDestination() != null && updatedEvent.getDestination().getId() != null) {
            Destination destination = destinationRepository.findById(updatedEvent.getDestination().getId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));
            existingEvent.setDestination(destination);
        }
        
        // Sauvegarder les modifications
        return eventRepository.save(existingEvent);
    }
    
    public void deleteEvent(Long id) {
        // Vérifier si l'événement existe
        Event event = getEventById(id);
        
        // Vérifier que l'utilisateur actuel est bien l'organisateur de l'événement
        User currentUser = userService.getCurrentUser();
        if (!event.getOrganizer().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ADMIN")) {
            throw new RuntimeException("You are not authorized to delete this event");
        }
        
        // Supprimer l'événement
        eventRepository.delete(event);
    }
}
