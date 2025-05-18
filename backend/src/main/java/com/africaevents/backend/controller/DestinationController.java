package com.africaevents.backend.controller;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    @Autowired
    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Destination> getDestinationBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(destinationService.getDestinationBySlug(slug));
    }
}
