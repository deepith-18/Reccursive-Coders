package com.company.placement.placement.dto;

import com.company.placement.placement.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String recruiterNotes;

    private Instant interviewDate;

    private BigDecimal offeredCtcLpa;
}
