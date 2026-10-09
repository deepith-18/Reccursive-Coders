package com.company.placement.batch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload to assign a trainer to a batch")
public class AssignTrainerRequest {

    @NotNull(message = "Trainer ID is required")
    @Schema(description = "User ID of the trainer to assign")
    private UUID trainerId;
}
