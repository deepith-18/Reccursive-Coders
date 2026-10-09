package com.company.placement.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Refresh token response with rotated credentials")
public class RefreshTokenResponse {

    @Schema(description = "New JWT Access Token")
    private String accessToken;

    @Schema(description = "Rotated refresh token")
    private String refreshToken;

    @Schema(description = "Token type", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @Schema(description = "Access token duration in seconds", example = "900")
    private long expiresIn;
}
