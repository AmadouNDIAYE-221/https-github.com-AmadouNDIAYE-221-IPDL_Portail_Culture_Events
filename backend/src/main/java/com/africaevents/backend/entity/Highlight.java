package com.africaevents.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Highlight {
    private String name;
    private String description;

    public Highlight() {}

    public Highlight(String name, String description) {
        this.name = name;
        this.description = description;
    }
}