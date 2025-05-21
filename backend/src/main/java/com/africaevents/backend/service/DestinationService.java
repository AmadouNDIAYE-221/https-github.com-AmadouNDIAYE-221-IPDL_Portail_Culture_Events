package com.africaevents.backend.service;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.entity.User;
import com.africaevents.backend.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Locale;
import com.github.slugify.Slugify;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    @Autowired
    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationBySlug(String slug) {
        return destinationRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Destination not found with slug: " + slug));
    }
    
    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
    }
    
    public Destination createDestination(Destination destination) {
        // Générer le slug à partir du nom si non fourni
        if (destination.getSlug() == null || destination.getSlug().isEmpty()) {
            Slugify slugify = Slugify.builder().build();
            destination.setSlug(slugify.slugify(destination.getName()));
        }
        
        // Initialiser les listes vides si elles sont nulles
        if (destination.getGallery() == null) {
            destination.setGallery(new java.util.ArrayList<>());
        }
        
        if (destination.getHighlights() == null) {
            destination.setHighlights(new java.util.ArrayList<>());
        }
        
        return destinationRepository.save(destination);
    }
    
    public Destination updateDestination(Long id, Destination updatedDestination) {
        // Vérifier si la destination existe
        Destination existingDestination = getDestinationById(id);
        
        // Mettre à jour les champs modifiables
        existingDestination.setName(updatedDestination.getName());
        existingDestination.setDescription(updatedDestination.getDescription());
        existingDestination.setHistory(updatedDestination.getHistory());
        existingDestination.setImage(updatedDestination.getImage());
        
        // Mettre à jour le slug si le nom a changé
        if (updatedDestination.getName() != null && !updatedDestination.getName().equals(existingDestination.getName())) {
            Slugify slugify = Slugify.builder().build();
            existingDestination.setSlug(slugify.slugify(updatedDestination.getName()));
        } else if (updatedDestination.getSlug() != null && !updatedDestination.getSlug().isEmpty()) {
            existingDestination.setSlug(updatedDestination.getSlug());
        }
        
        // Mettre à jour les points forts s'ils sont fournis
        if (updatedDestination.getHighlights() != null) {
            existingDestination.setHighlights(updatedDestination.getHighlights());
        }
        
        // Mettre à jour la galerie si elle est fournie
        if (updatedDestination.getGallery() != null) {
            existingDestination.setGallery(updatedDestination.getGallery());
        }
        
        return destinationRepository.save(existingDestination);
    }
    
    public void deleteDestination(Long id) {
        // Vérifier si la destination existe
        Destination destination = getDestinationById(id);
        
        // Vérifier si des événements sont liés à cette destination
        // Ce code pourrait être étendu pour vérifier les événements liés
        // Exemple : if (eventRepository.countByDestinationId(id) > 0) { throw exception }
        
        // Supprimer la destination
        destinationRepository.delete(destination);
    }
}
