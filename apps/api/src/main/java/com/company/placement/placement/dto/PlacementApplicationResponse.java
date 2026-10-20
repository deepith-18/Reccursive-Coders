package com.company.placement.placement.dto;

import com.company.placement.placement.ApplicationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementApplicationResponse {
    private UUID id;
    private UUID driveId;
    private String driveTitle;
    private String companyName;
    private String companyLogoUrl;
    private String jobRole;
    private BigDecimal packageCtcLpa;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String collegeName;
    private String branch;
    private Double cgpa;
    private String resumeUrl;
    private ApplicationStatus status;
    private Instant appliedAt;
    private String recruiterNotes;
    private Instant interviewDate;
    private BigDecimal offeredCtcLpa;
}
