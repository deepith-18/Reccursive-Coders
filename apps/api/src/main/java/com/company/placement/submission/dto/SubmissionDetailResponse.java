package com.company.placement.submission.dto;

import com.company.placement.execution.ProgrammingLanguage;
import com.company.placement.submission.SubmissionType;
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
public class SubmissionDetailResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID questionId;
    private String questionTitle;
    private String questionSlug;
    private UUID assignmentId;
    private String sourceCode;
    private ProgrammingLanguage language;
    private SubmissionType type;
    private SubmissionVerdict verdict;
    private int passedTestCases;
    private int totalTestCases;
    private int score;
    private Integer executionTimeMs;
    private Integer memoryKb;
    private String stdout;
    private String stderr;
    private String compileOutput;
    private Instant createdAt;

    @Builder.Default
    private List<TestCaseRunResultDto> testCaseResults = new ArrayList<>();
}
