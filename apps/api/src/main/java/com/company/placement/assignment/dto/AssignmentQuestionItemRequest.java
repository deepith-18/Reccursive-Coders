package com.company.placement.assignment.dto;

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
public class AssignmentQuestionItemRequest {

    @NotNull(message = "Question ID is required")
    private UUID questionId;

    @Builder.Default
    private Integer points = 10;

    @Builder.Default
    private Integer orderIndex = 0;
}
