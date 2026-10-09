package com.company.placement.batch.dto;

import com.company.placement.batch.BatchStatus;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Request payload to update an existing batch")
public class UpdateBatchRequest {

    @Size(min = 2, max = 150)
    private String name;

    private String description;

    private UUID trainerId;

    private LocalDate startDate;

    private LocalDate endDate;

    private BatchStatus status;
}
