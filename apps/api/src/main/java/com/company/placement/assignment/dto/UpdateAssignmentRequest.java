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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssignmentRequest {

    @NotBlank(message = "Assignment title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    private Instant dueDate;

    private Instant startDate;

    @NotNull(message = "Status is required")
    private AssignmentStatus status;

    @Valid
    @Builder.Default
    private List<AssignmentQuestionItemRequest> questions = new ArrayList<>();
}
