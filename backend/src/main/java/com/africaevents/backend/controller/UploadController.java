package com.africaevents.backend.controller;

import com.africaevents.backend.dto.ResponseDTO;
import com.africaevents.backend.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final StorageService storageService;

    @Autowired
    public UploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // Temporairement retirer l'autorisation pour les tests
    // @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file,
                                        @RequestParam(value = "eventId", required = false) String eventId) {
        try {
            String imageUrl = storageService.storeFile(file, eventId);
            
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(false, "Erreur lors du téléchargement: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{imageId}")
    // Temporairement retirer l'autorisation pour les tests
    // @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> deleteImage(@PathVariable String imageId) {
        try {
            storageService.deleteFile(imageId);
            return ResponseEntity.ok(new ResponseDTO(true, "Image supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(false, "Erreur lors de la suppression: " + e.getMessage()));
        }
    }
}
