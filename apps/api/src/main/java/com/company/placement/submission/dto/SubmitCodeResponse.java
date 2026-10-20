package com.company.placement.submission.dto;

import com.company.placement.submission.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitCodeResponse {
    private UUID submissionId;
    private SubmissionVerdict verdict;
    private int passedTestCases;
    private int totalTestCases;
    private int score;
    private Integer executionTimeMs;
    private Integer memoryKb;
    private String compileOutput;
    private Instant submittedAt;

    @Builder.Default
    private List<TestCaseRunResultDto> testCaseResults = new ArrayList<>();
}
