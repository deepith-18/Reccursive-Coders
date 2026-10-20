package com.company.placement.assessment.dto;

import com.company.placement.assessment.AssessmentStatus;
import com.company.placement.assessment.AssessmentType;
import com.company.placement.assessment.AttemptStatus;
import com.company.placement.assessment.ProctoringLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSummaryDto {
    private UUID id;
    private String title;
    private String description;
    private String companyTag;
    private AssessmentType type;
    private AssessmentStatus status;
    private ProctoringLevel proctoringLevel;
    private Integer durationMinutes;
    private Integer maxViolationsAllowed;
    private Integer passingScore;
    private Integer totalPoints;
    private Integer questionCount;
    private Instant startsAt;
    private Instant endsAt;
    private UUID batchId;
    private String createdByName;
    private AttemptStatus myAttemptStatus;
    private Integer myScore;
    private Instant myStartedAt;
    private Instant mySubmittedAt;
}
