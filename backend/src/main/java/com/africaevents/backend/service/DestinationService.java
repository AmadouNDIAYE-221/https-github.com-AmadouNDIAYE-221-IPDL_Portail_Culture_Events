package com.africaevents.backend.service;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.exception.ResourceNotFoundException;
import com.africaevents.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public Destination findBySlug(String slug) {
        return destinationRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Destination not found with slug: " + slug));
    }

    public List<Destination> findAll() {
        return destinationRepository.findAll();
    }
}
