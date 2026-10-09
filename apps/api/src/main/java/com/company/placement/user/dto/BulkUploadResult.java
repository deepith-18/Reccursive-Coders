package com.company.placement.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Bulk user upload summary result")
public class BulkUploadResult {

    @Schema(description = "Total records processed")
    private int totalProcessed;

    @Schema(description = "Successfully imported accounts count")
    private int totalSuccess;

    @Schema(description = "Failed accounts count")
    private int totalFailed;

    @Schema(description = "List of row failure details")
    private List<String> errors;

    @Schema(description = "List of created user profiles")
    private List<UserResponse> createdUsers;
}
