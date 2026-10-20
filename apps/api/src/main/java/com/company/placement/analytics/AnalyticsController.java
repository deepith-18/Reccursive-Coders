package com.company.placement.analytics;

import com.company.placement.analytics.dto.AnalyticsOverviewDto;
import com.company.placement.analytics.dto.BatchAnalyticsDto;
import com.company.placement.analytics.dto.TopicMasteryDto;
import com.company.placement.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Platform Analytics", description = "Endpoints for platform metrics, weak topics radar, and cohort progress")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Get platform-wide operational KPIs and language distribution")
    public ResponseEntity<ApiResponse<AnalyticsOverviewDto>> getOverview() {
        AnalyticsOverviewDto overview = analyticsService.getOverview();
        return ResponseEntity.ok(ApiResponse.ok(overview));
    }

    @GetMapping("/weak-topics")
    @Operation(summary = "Get Weak Topics Radar accuracy and mastery distribution")
    public ResponseEntity<ApiResponse<List<TopicMasteryDto>>> getWeakTopicsRadar() {
        List<TopicMasteryDto> topics = analyticsService.getWeakTopicsRadar();
        return ResponseEntity.ok(ApiResponse.ok(topics));
    }

    @GetMapping("/batches/{batchId}")
    @Operation(summary = "Get performance analytics for a specific cohort batch")
    public ResponseEntity<ApiResponse<BatchAnalyticsDto>> getBatchAnalytics(@PathVariable UUID batchId) {
        BatchAnalyticsDto batchAnalytics = analyticsService.getBatchAnalytics(batchId);
        return ResponseEntity.ok(ApiResponse.ok(batchAnalytics));
    }

    @GetMapping("/batches")
    @Operation(summary = "Get cohort analytics across all active batches")
    public ResponseEntity<ApiResponse<List<BatchAnalyticsDto>>> getAllBatchesAnalytics() {
        List<BatchAnalyticsDto> batches = analyticsService.getAllBatchesAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(batches));
    }
}
