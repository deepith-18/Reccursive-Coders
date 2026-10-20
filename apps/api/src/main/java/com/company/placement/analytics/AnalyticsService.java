package com.company.placement.analytics;

import com.company.placement.analytics.dto.AnalyticsOverviewDto;
import com.company.placement.analytics.dto.BatchAnalyticsDto;
import com.company.placement.analytics.dto.TopicMasteryDto;

import java.util.List;
import java.util.UUID;

public interface AnalyticsService {

    AnalyticsOverviewDto getOverview();

    List<TopicMasteryDto> getWeakTopicsRadar();

    BatchAnalyticsDto getBatchAnalytics(UUID batchId);

    List<BatchAnalyticsDto> getAllBatchesAnalytics();
}
