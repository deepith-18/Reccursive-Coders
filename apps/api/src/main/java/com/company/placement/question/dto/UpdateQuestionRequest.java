package com.company.placement.question.dto;

import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuestionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Description in markdown format is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private QuestionDifficulty difficulty;

    private String tags;

    @NotNull(message = "Time limit is required")
    private Integer timeLimitMs;

    @NotNull(message = "Memory limit is required")
    private Integer memoryLimitMb;

    @NotNull(message = "Status is required")
    private QuestionStatus status;

    private String starterCodeJava;
    private String starterCodePython;
    private String starterCodeCpp;
}
