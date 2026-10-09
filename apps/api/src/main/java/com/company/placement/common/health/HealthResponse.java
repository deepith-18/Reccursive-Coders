package com.company.placement.common.health;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "System health check response")
public class HealthResponse {

    @Schema(description = "Overall health status", example = "UP")
    private String status;

    @Schema(description = "Application name", example = "placement-api")
    private String service;

    @Schema(description = "Current server timestamp")
    private Instant timestamp;

    @Schema(description = "Active environment profile", example = "default")
    private String activeProfile;

    @Schema(description = "Subsystem health statuses")
    private Map<String, Object> details;
}
