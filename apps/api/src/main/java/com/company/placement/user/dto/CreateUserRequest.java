package com.company.placement.user.dto;

import com.company.placement.user.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for creating a user")
public class CreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Schema(description = "User email address", example = "student@company.com")
    private String email;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters")
    @Schema(description = "User's full name", example = "Jane Smith")
    private String fullName;

    @Schema(description = "Phone number", example = "+91 9876543210")
    private String phone;

    @NotNull(message = "Role is required")
    @Schema(description = "Role to assign", example = "STUDENT")
    private Role role;

    @Schema(description = "Optional initial password. Defaults to Welcome@2026! if omitted", example = "Welcome@2026!")
    private String temporaryPassword;
}
