package com.company.placement.assignment.dto;

import com.company.placement.question.QuestionDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentQuestionDto {
    private UUID questionId;
    private String title;
    private String slug;
    private QuestionDifficulty difficulty;
    private String tags;
    private Integer points;
    private Integer orderIndex;
}
