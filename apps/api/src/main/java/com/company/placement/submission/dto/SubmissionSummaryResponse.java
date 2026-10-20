package com.company.placement.submission.dto;

import com.company.placement.execution.ProgrammingLanguage;
import com.company.placement.submission.SubmissionVerdict;
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
public class SubmissionSummaryResponse {
    private UUID id;
    private UUID questionId;
    private String questionTitle;
    private String questionSlug;
    private UUID assignmentId;
    private ProgrammingLanguage language;
    private SubmissionVerdict verdict;
    private int passedTestCases;
    private int totalTestCases;
    private int score;
    private Integer executionTimeMs;
    private Instant createdAt;
}
