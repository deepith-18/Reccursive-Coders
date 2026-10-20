package com.company.placement.question.dto;

import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateQuestionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Description in markdown format is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    @Builder.Default
    private QuestionDifficulty difficulty = QuestionDifficulty.EASY;

    private String tags;

    @Builder.Default
    private Integer timeLimitMs = 1000;

    @Builder.Default
    private Integer memoryLimitMb = 256;

    @Builder.Default
    private QuestionStatus status = QuestionStatus.PUBLISHED;

    private String starterCodeJava;
    private String starterCodePython;
    private String starterCodeCpp;

    @Valid
    @Builder.Default
    private List<CreateTestCaseRequest> testCases = new ArrayList<>();
}
