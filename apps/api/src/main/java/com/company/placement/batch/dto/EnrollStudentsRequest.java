package com.company.placement.batch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload to enroll students into a batch")
public class EnrollStudentsRequest {

    @NotEmpty(message = "At least one student ID must be provided")
    @Schema(description = "List of student user UUIDs to enroll")
    private List<UUID> studentIds;
}
