package com.company.placement.placement.dto;

import com.company.placement.placement.DriveStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlacementDriveRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyLogoUrl;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Package CTC is required")
    private BigDecimal packageCtcLpa;

    private String location;

    private Double minCgpa;

    private String eligibleBranches;

    private Integer minCodingScore;

    private Instant driveDate;

    @NotNull(message = "Application deadline is required")
    private Instant applicationDeadline;

    private DriveStatus status;

    private Integer openingsCount;
}
