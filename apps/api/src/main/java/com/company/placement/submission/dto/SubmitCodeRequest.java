package com.company.placement.submission.dto;

import com.company.placement.execution.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitCodeRequest {

    @NotNull(message = "Question ID is required")
    private UUID questionId;

    private UUID assignmentId;

    @NotBlank(message = "Source code is required")
    private String sourceCode;

    @NotNull(message = "Language is required")
    private ProgrammingLanguage language;
}
