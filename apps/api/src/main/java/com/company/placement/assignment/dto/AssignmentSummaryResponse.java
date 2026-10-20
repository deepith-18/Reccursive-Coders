package com.company.placement.assignment.dto;

import com.company.placement.assignment.AssignmentStatus;
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
public class AssignmentSummaryResponse {
    private UUID id;
    private UUID batchId;
    private String batchName;
    private String batchCode;
    private String title;
    private String description;
    private Instant dueDate;
    private Instant startDate;
    private AssignmentStatus status;
    private int totalPoints;
    private int questionCount;
    private boolean isPastDue;
    private UUID authorId;
    private String authorName;
    private Instant createdAt;
}
