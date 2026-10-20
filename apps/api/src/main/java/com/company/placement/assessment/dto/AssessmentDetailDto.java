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
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDetailDto {
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
    private Instant startsAt;
    private Instant endsAt;
    private UUID batchId;
    private List<AssessmentQuestionDto> questions;
    private AttemptStatus myAttemptStatus;
    private Integer myScore;
    private Integer tabSwitchCount;
    private Integer copyPasteCount;
    private Long remainingSeconds;
    private String feedbackNotes;
}
