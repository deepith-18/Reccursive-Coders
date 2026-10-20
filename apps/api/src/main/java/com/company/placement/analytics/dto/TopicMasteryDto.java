package com.company.placement.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicMasteryDto {
    private String category;
    private long totalAttempts;
    private long acceptedCount;
    private double accuracyRate;
    private String status; // "STRONG", "MODERATE", "NEEDS_ATTENTION"
}
