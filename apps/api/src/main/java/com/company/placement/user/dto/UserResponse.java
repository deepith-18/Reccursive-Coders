package com.company.placement.user.dto;

import com.company.placement.user.Role;
import com.company.placement.user.UserStatus;
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
@Schema(description = "User profile response")
public class UserResponse {

    @Schema(description = "Unique user identifier")
    private UUID id;

    @Schema(description = "User email address", example = "john.doe@company.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String fullName;

    @Schema(description = "Optional phone number", example = "+91 9876543210")
    private String phone;

    @Schema(description = "Platform role", example = "STUDENT")
    private Role role;

    @Schema(description = "Account status", example = "ACTIVE")
    private UserStatus status;

    @Schema(description = "Whether the user must change password upon next login")
    private boolean forcePasswordChange;

    @Schema(description = "Account creation timestamp")
    private Instant createdAt;
}
