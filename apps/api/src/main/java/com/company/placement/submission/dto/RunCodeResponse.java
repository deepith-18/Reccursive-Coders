package com.company.placement.submission.dto;

import com.company.placement.submission.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunCodeResponse {
    private SubmissionVerdict overallVerdict;
    private boolean compileSuccess;
    private String compileOutput;
    private int totalSampleCases;
    private int passedSampleCases;

    @Builder.Default
    private List<TestCaseRunResultDto> testCaseResults = new ArrayList<>();
}
