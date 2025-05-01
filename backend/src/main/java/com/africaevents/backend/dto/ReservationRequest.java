package com.africaevents.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReservationRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String phone;

    @Min(1)
    private int numberOfTickets;
}
