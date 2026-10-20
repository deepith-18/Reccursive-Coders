package com.company.placement.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordViolationRequest {
    private String violationType; // "TAB_SWITCH", "COPY_PASTE", "FULLSCREEN_EXIT"
    private String details;
}
