package com.company.placement.question.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestCaseRequest {

    @NotBlank(message = "Input data is required")
    private String inputData;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    @Builder.Default
    private Boolean isSample = false;

    private String explanation;

    @Builder.Default
    private Integer orderIndex = 0;
}
