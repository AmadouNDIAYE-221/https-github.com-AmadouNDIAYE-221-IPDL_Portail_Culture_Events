package com.africaevents.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Highlight {
    private String name;
    private String description;
    private String image;  // Nouveau champ pour stocker l'URL de l'image

    public Highlight() {}

    public Highlight(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    public Highlight(String name, String description, String image) {
        this.name = name;
        this.description = description;
        this.image = image;
    }
}