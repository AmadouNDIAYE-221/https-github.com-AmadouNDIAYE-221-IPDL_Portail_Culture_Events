package com.africaevents.backend.repository;

import com.africaevents.backend.entity.Event;
import com.africaevents.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByLocationContainingIgnoreCase(String location);

    List<Event> findByLocation(String location);
    
    /**
     * Trouve tous les événements créés par un organisateur spécifique
     * @param organizerId ID de l'organisateur
     * @return Liste des événements de l'organisateur
     */
    List<Event> findByOrganizerId(Long organizerId);
    
    /**
     * Trouve tous les événements créés par un organisateur spécifique
     * @param organizer L'entité organisateur
     * @return Liste des événements de l'organisateur
     */
    List<Event> findByOrganizer(User organizer);
}