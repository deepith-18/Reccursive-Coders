package com.company.placement.question.dto;

import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionStatus;
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
public class QuestionResponse {
    private UUID id;
    private String title;
    private String slug;
    private String description;
    private QuestionDifficulty difficulty;
    private String tags;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private QuestionStatus status;
    private String starterCodeJava;
    private String starterCodePython;
    private String starterCodeCpp;
    private UUID authorId;
    private String authorName;
    private Instant createdAt;
    private Instant updatedAt;

    @Builder.Default
    private List<TestCaseDto> testCases = new ArrayList<>();

    private int totalTestCasesCount;
    private int hiddenTestCasesCount;
}
