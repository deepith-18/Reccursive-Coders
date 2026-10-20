package com.company.placement.submission.dto;

import com.company.placement.submission.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRunResultDto {
    private int testCaseNumber;
    private boolean isSample;
    private SubmissionVerdict status;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private String stderr;
    private Integer executionTimeMs;
    private Integer memoryKb;
}
