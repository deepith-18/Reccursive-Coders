package com.company.placement.assessment.dto;

import com.company.placement.assessment.AttemptStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordViolationResponse {
    private Integer tabSwitchCount;
    private Integer copyPasteCount;
    private Integer maxViolationsAllowed;
    private boolean isDisqualified;
    private AttemptStatus status;
    private String warningMessage;
}
