package com.company.placement.batch.dto;

import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Enrolled student detail in a cohort")
public class BatchStudentResponse {

    @Schema(description = "Enrollment ID")
    private UUID id;

    @Schema(description = "Student user account details")
    private UserResponse student;

    @Schema(description = "Student academic profile if completed")
    private StudentProfileResponse profile;

    @Schema(description = "Enrollment timestamp")
    private Instant enrolledAt;
}
