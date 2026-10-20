package com.company.placement.execution;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResult {
    private Judge0Status status;
    private boolean passed;
    private String stdout;
    private String stderr;
    private String compileOutput;
    private Integer executionTimeMs;
    private Integer memoryKb;
}
