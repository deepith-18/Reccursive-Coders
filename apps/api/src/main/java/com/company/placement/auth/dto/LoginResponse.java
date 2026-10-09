package com.company.placement.auth.dto;

import com.company.placement.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication successful response")
public class LoginResponse {

    @Schema(description = "JWT Access Token for Bearer authentication")
    private String accessToken;

    @Schema(description = "Refresh token for rotating access tokens")
    private String refreshToken;

    @Schema(description = "Token type", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @Schema(description = "Access token duration in seconds", example = "900")
    private long expiresIn;

    @Schema(description = "Authenticated user profile")
    private UserResponse user;
}
