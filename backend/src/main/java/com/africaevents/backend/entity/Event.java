package com.africaevents.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private int capacity;
    private double price;
    private String category;

    @ElementCollection
    private List<String> gallery;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;
}
