package com.africaevents.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @FutureOrPresent
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @NotBlank
    private String location;

    @Min(1)
    private int capacity;

    @Min(0)
    private double price;

    @NotBlank
    private String category;

    private List<String> gallery;
}
