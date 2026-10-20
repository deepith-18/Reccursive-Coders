package com.company.placement.assessment.dto;

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
public class AssessmentQuestionDto {
    private UUID id;
    private UUID questionId;
    private String title;
    private String slug;
    private String description;
    private QuestionDifficulty difficulty;
    private String sectionName;
    private Integer points;
    private Integer sortOrder;
    private String sampleCasesJson;
}
