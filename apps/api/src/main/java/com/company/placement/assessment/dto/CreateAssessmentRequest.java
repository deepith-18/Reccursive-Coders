package com.company.placement.assessment.dto;

import com.company.placement.assessment.AssessmentStatus;
import com.company.placement.assessment.AssessmentType;
import com.company.placement.assessment.ProctoringLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateAssessmentRequest {

    @NotBlank(message = "Assessment title is required")
    private String title;

    private String description;

    private String companyTag;

    @NotNull(message = "Assessment type is required")
    private AssessmentType type;

    @Builder.Default
    private AssessmentStatus status = AssessmentStatus.ACTIVE;

    @Builder.Default
    private ProctoringLevel proctoringLevel = ProctoringLevel.STRICT;

    @NotNull(message = "Duration in minutes is required")
    private Integer durationMinutes;

    @Builder.Default
    private Integer maxViolationsAllowed = 3;

    @Builder.Default
    private Integer passingScore = 60;

    private Instant startsAt;

    private Instant endsAt;

    private UUID batchId;

    private List<AssessmentQuestionItem> questions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentQuestionItem {
        private UUID questionId;
        private String sectionName;
        private Integer points;
        private Integer sortOrder;
    }
}
