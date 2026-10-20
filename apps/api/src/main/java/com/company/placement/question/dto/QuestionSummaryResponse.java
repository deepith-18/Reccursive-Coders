package com.company.placement.question.dto;

import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSummaryResponse {
    private UUID id;
    private String title;
    private String slug;
    private QuestionDifficulty difficulty;
    private String tags;
    private QuestionStatus status;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private UUID authorId;
    private String authorName;
    private int sampleCasesCount;
    private int totalCasesCount;
    private Instant createdAt;
}
