package com.africaevents.backend.service;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
