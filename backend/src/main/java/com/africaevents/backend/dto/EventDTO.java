package com.africaevents.backend.dto;

import com.africaevents.backend.entity.Destination;
import com.africaevents.backend.entity.Event;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import com.africaevents.backend.entity.EventStatus;

public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String date;
    private String time;
    private String startDate;
    private String endDate;
    private EventStatus status;
    private Long destinationId;
    private String destinationName; // Nouveau champ pour le nom de la destination
    private String category;
    private int capacity;
    private int availableCapacity;
    private int totalCapacity;
    private double price;
    private String imageUrl;
    
    // Getters et setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getDate() {
        return date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }
    
    public String getTime() {
        return time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }
    
    public Long getDestinationId() {
        return destinationId;
    }
    
    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }
    
    public String getDestinationName() {
        return destinationName;
    }
    
    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public int getCapacity() {
        return capacity;
    }
    
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
    
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getStartDate() {
        return startDate;
    }
    
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    
    public String getEndDate() {
        return endDate;
    }
    
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    
    public EventStatus getStatus() {
        return status;
    }
    
    public void setStatus(EventStatus status) {
        this.status = status;
    }
    
    public int getAvailableCapacity() {
        return availableCapacity;
    }
    
    public void setAvailableCapacity(int availableCapacity) {
        this.availableCapacity = availableCapacity;
    }
    
    public int getTotalCapacity() {
        return totalCapacity;
    }
    
    public void setTotalCapacity(int totalCapacity) {
        this.totalCapacity = totalCapacity;
    }
    
    // Méthode pour convertir le DTO en entité
    public Event toEntity() {
        Event event = new Event();
        event.setId(this.id);
        event.setTitle(this.title);
        event.setDescription(this.description);
        
        // Convertir la chaîne de date en LocalDate
        if (this.date != null && !this.date.isEmpty()) {
            try {
                // Gestion de format ISO ou de format personnalisé
                if (this.date.contains("T")) {
                    // Format ISO
                    String[] dateParts = this.date.split("T")[0].split("-");
                    int year = Integer.parseInt(dateParts[0]);
                    int month = Integer.parseInt(dateParts[1]);
                    int day = Integer.parseInt(dateParts[2]);
                    event.setDate(LocalDate.of(year, month, day));
                } else {
                    // Format YYYY-MM-DD
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    event.setDate(LocalDate.parse(this.date, formatter));
                }
            } catch (Exception e) {
                event.setDate(LocalDate.now()); // Default to today if parsing fails
            }
        }
        
        // Convertir la chaîne d'heure en LocalTime
        if (this.time != null && !this.time.isEmpty()) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
                event.setTime(LocalTime.parse(this.time, formatter));
            } catch (Exception e) {
                event.setTime(LocalTime.now()); // Default to now if parsing fails
            }
        }
        
        // Créer un objet Destination juste avec l'ID (sera résolu par le service)
        if (this.destinationId != null) {
            Destination destination = new Destination();
            destination.setId(this.destinationId);
            event.setDestination(destination);
        }
        
        // Convertir les chaînes startDate et endDate en LocalDateTime
        if (this.startDate != null && !this.startDate.isEmpty()) {
            try {
                if (this.startDate.contains("T")) {
                    event.setStartDate(LocalDateTime.parse(this.startDate));
                } else {
                    // Construire à partir de date et heure si nécessaire
                    LocalDate parsedDate = event.getDate() != null ? event.getDate() : LocalDate.now();
                    LocalTime parsedTime = event.getTime() != null ? event.getTime() : LocalTime.now();
                    event.setStartDate(LocalDateTime.of(parsedDate, parsedTime));
                }
            } catch (Exception e) {
                // Utiliser la date courante par défaut
                event.setStartDate(LocalDateTime.now());
            }
        }
        
        if (this.endDate != null && !this.endDate.isEmpty()) {
            try {
                if (this.endDate.contains("T")) {
                    event.setEndDate(LocalDateTime.parse(this.endDate));
                } else {
                    // Par défaut, fin 2 heures après le début
                    event.setEndDate(event.getStartDate() != null ? 
                                     event.getStartDate().plusHours(2) : 
                                     LocalDateTime.now().plusHours(2));
                }
            } catch (Exception e) {
                // Utiliser la date courante + 2h par défaut
                event.setEndDate(LocalDateTime.now().plusHours(2));
            }
        }
        
        // Définir le statut
        event.setStatus(this.status);

        event.setCategory(this.category);
        event.setCapacity(this.capacity);
        
        // Définir availableCapacity et totalCapacity
        if (this.availableCapacity > 0) {
            event.setAvailableCapacity(this.availableCapacity);
        } else {
            event.setAvailableCapacity(this.capacity); // Par défaut, égal à capacity
        }
        
        if (this.totalCapacity > 0) {
            event.setTotalCapacity(this.totalCapacity);
        } else {
            event.setTotalCapacity(this.capacity); // Par défaut, égal à capacity
        }
        
        event.setPrice(this.price);
        event.setImageUrl(this.imageUrl);
        
        return event;
    }
    
    // Méthode statique pour convertir une entité en DTO
    public static EventDTO fromEntity(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        
        if (event.getDate() != null) {
            dto.setDate(event.getDate().toString());
        }
        
        if (event.getTime() != null) {
            dto.setTime(event.getTime().toString());
        }
        
        if (event.getDestination() != null) {
            dto.setDestinationId(event.getDestination().getId());
            dto.setDestinationName(event.getDestination().getName()); // Remplir le champ destinationName
        }
        
        // Conversion des nouveaux champs
        if (event.getStartDate() != null) {
            dto.setStartDate(event.getStartDate().toString());
        }
        
        if (event.getEndDate() != null) {
            dto.setEndDate(event.getEndDate().toString());
        }
        
        dto.setStatus(event.getStatus());
        dto.setCategory(event.getCategory());
        dto.setCapacity(event.getCapacity());
        dto.setAvailableCapacity(event.getAvailableCapacity());
        dto.setTotalCapacity(event.getTotalCapacity());
        dto.setPrice(event.getPrice());
        dto.setImageUrl(event.getImageUrl());
        
        return dto;
    }
}
