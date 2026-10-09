package com.company.placement.batch.dto;

import com.company.placement.batch.BatchStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload to create a new batch")
public class CreateBatchRequest {

    @NotBlank(message = "Batch name is required")
    @Size(min = 2, max = 150, message = "Batch name must be between 2 and 150 characters")
    @Schema(description = "Batch title", example = "Full Stack Java 2026")
    private String name;

    @NotBlank(message = "Batch code is required")
    @Size(min = 2, max = 50, message = "Batch code must be between 2 and 50 characters")
    @Schema(description = "Unique batch code", example = "FS-JAVA-2026-01")
    private String code;

    @Schema(description = "Description or syllabus overview")
    private String description;

    @Schema(description = "Optional Trainer user ID assigned to this batch")
    private UUID trainerId;

    @Schema(description = "Start date", example = "2026-02-01")
    private LocalDate startDate;

    @Schema(description = "End date", example = "2026-06-30")
    private LocalDate endDate;

    @Schema(description = "Initial status (defaults to ACTIVE)", example = "ACTIVE")
    private BatchStatus status;
}
