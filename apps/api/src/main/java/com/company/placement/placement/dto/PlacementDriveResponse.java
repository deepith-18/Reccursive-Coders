package com.company.placement.placement.dto;

import com.company.placement.placement.DriveStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementDriveResponse {
    private UUID id;
    private String title;
    private String companyName;
    private String companyLogoUrl;
    private String jobRole;
    private String description;
    private BigDecimal packageCtcLpa;
    private String location;
    private Double minCgpa;
    private String eligibleBranches;
    private Integer minCodingScore;
    private Instant driveDate;
    private Instant applicationDeadline;
    private DriveStatus status;
    private Integer openingsCount;
    private long applicantCount;
    private boolean isApplied;
    private boolean isEligible;
    private String eligibilityReason;
    private Instant createdAt;
}
