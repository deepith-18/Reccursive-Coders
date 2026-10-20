package com.company.placement.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAssessmentRequest {
    private Map<String, Object> answersPayload;
    private Integer earnedScore;
    private String feedbackNotes;
}
