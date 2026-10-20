package com.company.placement.assignment.dto;

import com.company.placement.assignment.AssignmentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateAssignmentRequest {

    @NotNull(message = "Batch ID is required")
    private UUID batchId;

    @NotBlank(message = "Assignment title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    private Instant dueDate;

    private Instant startDate;

    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.PUBLISHED;

    @Valid
    @Builder.Default
    private List<AssignmentQuestionItemRequest> questions = new ArrayList<>();
}
