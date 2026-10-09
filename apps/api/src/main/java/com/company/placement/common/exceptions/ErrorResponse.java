package com.company.placement.common.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standardized error response payload")
public class ErrorResponse {

    @Schema(description = "HTTP Status code", example = "400")
    private int status;

    @Schema(description = "Machine-readable error code", example = "VALIDATION_FAILED")
    private String errorCode;

    @Schema(description = "Human-readable error message", example = "One or more validation constraints failed")
    private String message;

    @Schema(description = "Request path", example = "/api/v1/health")
    private String path;

    @Schema(description = "Timestamp when error occurred")
    private Instant timestamp;

    @Schema(description = "Detailed field validation errors if applicable")
    private Map<String, List<String>> validationErrors;
}
