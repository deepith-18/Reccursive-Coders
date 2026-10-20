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
public class AssessmentLeaderboardEntryDto {
    private Integer rank;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private Integer score;
    private Long timeTakenSeconds;
    private Integer tabSwitchCount;
    private AttemptStatus status;
    private Instant submittedAt;
}
