package com.company.placement.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDto {
    private long totalStudents;
    private long totalTrainers;
    private long totalBatches;
    private long totalQuestions;
    private long totalSubmissions;
    private long acceptedSubmissions;
    private double globalAcceptanceRate;
    private long activeStudentsToday;
    private long totalPlacementDrives;
    private Map<String, Long> languageBreakdown;
}
