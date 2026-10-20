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
public class AssessmentRosterEntryDto {
    private UUID attemptId;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private AttemptStatus status;
    private Integer score;
    private Integer tabSwitchCount;
    private Integer copyPasteCount;
    private Instant startedAt;
    private Instant submittedAt;
    private Long timeTakenSeconds;
}
