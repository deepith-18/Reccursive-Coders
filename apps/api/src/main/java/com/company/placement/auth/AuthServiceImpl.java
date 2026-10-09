package com.company.placement.auth;

import com.company.placement.auth.dto.ChangePasswordRequest;
import com.company.placement.auth.dto.LoginRequest;
import com.company.placement.auth.dto.LoginResponse;
import com.company.placement.auth.dto.RefreshTokenRequest;
import com.company.placement.auth.dto.RefreshTokenResponse;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import com.company.placement.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;

    @Value("${app.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.jwt.access-token-expiration-ms:900000}")
    private long accessTokenExpirationMs;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> {
                    auditLogService.record(null, request.getEmail(), "LOGIN_FAILED", "AUTH", null, "User not found", clientIp);
                    return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
                });

        if (user.getStatus() == UserStatus.INACTIVE) {
            auditLogService.record(user.getId(), user.getEmail(), "LOGIN_BLOCKED", "AUTH", user.getId().toString(), "Account is inactive", clientIp);
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_INACTIVE", "Your account has been deactivated. Please contact an administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditLogService.record(user.getId(), user.getEmail(), "LOGIN_FAILED", "AUTH", user.getId().toString(), "Password mismatch", clientIp);
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String rawRefreshToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        String hashedToken = hashToken(rawRefreshToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().plus(refreshTokenExpirationMs, ChronoUnit.MILLIS))
                .revoked(false)
                .createdAt(Instant.now())
                .build();
        refreshTokenRepository.save(refreshToken);

        auditLogService.record(user.getId(), user.getEmail(), "LOGIN_SUCCESS", "AUTH", user.getId().toString(), "Login successful", clientIp);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public RefreshTokenResponse refresh(RefreshTokenRequest request, HttpServletRequest httpRequest) {
        String hashedToken = hashToken(request.getRefreshToken());
        RefreshToken storedToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(hashedToken)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Invalid or revoked refresh token"));

        if (storedToken.getExpiresAt().isBefore(Instant.now())) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new ApiException(HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_EXPIRED", "Refresh token has expired");
        }

        User user = storedToken.getUser();
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_INACTIVE", "Account is inactive");
        }

        // Revoke used token (Token Rotation)
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        // Issue new rotated refresh token & access token
        String newRawRefreshToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(newRawRefreshToken))
                .expiresAt(Instant.now().plus(refreshTokenExpirationMs, ChronoUnit.MILLIS))
                .revoked(false)
                .createdAt(Instant.now())
                .build();
        refreshTokenRepository.save(newRefreshToken);

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(principal);

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .build();
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request, HttpServletRequest httpRequest) {
        String hashedToken = hashToken(request.getRefreshToken());
        refreshTokenRepository.findByTokenHashAndRevokedFalse(hashedToken)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                    auditLogService.record(
                            token.getUser().getId(),
                            token.getUser().getEmail(),
                            "LOGOUT",
                            "AUTH",
                            token.getUser().getId().toString(),
                            "User logged out",
                            getClientIp(httpRequest)
                    );
                });
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "Current password does not match");
        }

        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_SAME", "New password cannot be the same as old password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setForcePasswordChange(false);
        userRepository.save(user);

        // Invalidate previous refresh tokens
        refreshTokenRepository.revokeAllForUser(user.getId());

        auditLogService.record(
                user.getId(),
                user.getEmail(),
                "PASSWORD_CHANGED",
                "USER",
                user.getId().toString(),
                "Password changed successfully",
                getClientIp(httpRequest)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserResponse(user);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .forcePasswordChange(user.isForcePasswordChange())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
