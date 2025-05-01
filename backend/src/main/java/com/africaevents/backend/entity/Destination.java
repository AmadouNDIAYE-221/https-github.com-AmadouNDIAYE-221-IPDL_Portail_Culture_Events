package com.africaevents.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;
    private String description;
    private String image;
    private String history;

    @ElementCollection
    private List<String> gallery;

    @ElementCollection
    @CollectionTable(name = "destination_highlights")
    private List<Highlight> highlights;

    @Embeddable
    @Data
    public static class Highlight {
        private String name;
        private String description;
    }
}
