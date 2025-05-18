package com.africaevents.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String history;
    private String image;
    private String slug;

    @ElementCollection
    private List<Highlight> highlights;

    @ElementCollection
    private List<String> gallery;
}