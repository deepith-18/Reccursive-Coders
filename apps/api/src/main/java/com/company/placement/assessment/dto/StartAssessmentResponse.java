package com.company.placement.assessment.dto;

import com.company.placement.assessment.AttemptStatus;
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
public class StartAssessmentResponse {
    private UUID attemptId;
    private UUID assessmentId;
    private Instant startedAt;
    private Long remainingSeconds;
    private Integer maxViolationsAllowed;
    private AttemptStatus status;
}
