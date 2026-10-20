package com.company.placement.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchAnalyticsDto {
    private UUID batchId;
    private String batchName;
    private String batchCode;
    private int enrolledStudents;
    private long totalSubmissions;
    private double averageScore;
    private double averageStreak;
    private double assignmentCompletionRate;
}
