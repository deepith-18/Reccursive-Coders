package com.company.placement.batch.dto;

import com.company.placement.batch.BatchStatus;
import com.company.placement.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Batch details response")
public class BatchResponse {

    @Schema(description = "Batch unique identifier")
    private UUID id;

    @Schema(description = "Batch title/name", example = "Full Stack Java 2026")
    private String name;

    @Schema(description = "Batch unique reference code", example = "FS-JAVA-2026-01")
    private String code;

    @Schema(description = "Curriculum or batch description")
    private String description;

    @Schema(description = "Assigned trainer profile")
    private UserResponse trainer;

    @Schema(description = "Cohort start date", example = "2026-02-01")
    private LocalDate startDate;

    @Schema(description = "Cohort expected end date", example = "2026-06-30")
    private LocalDate endDate;

    @Schema(description = "Batch operational status", example = "ACTIVE")
    private BatchStatus status;

    @Schema(description = "Total number of enrolled students", example = "45")
    private long studentCount;

    @Schema(description = "Creation timestamp")
    private Instant createdAt;
}
