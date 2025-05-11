package com.africaevents.backend.controller;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Destination> getDestination(@PathVariable String slug) {
        Destination destination = destinationService.findBySlug(slug);
        return ResponseEntity.ok(destination);
    }

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        List<Destination> destinations = destinationService.findAll();
        return ResponseEntity.ok(destinations);
    }
}
