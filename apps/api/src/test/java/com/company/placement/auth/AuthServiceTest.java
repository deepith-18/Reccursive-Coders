package com.company.placement.auth;

import com.company.placement.auth.dto.ChangePasswordRequest;
import com.company.placement.auth.dto.LoginRequest;
import com.company.placement.auth.dto.LoginResponse;
import com.company.placement.auth.dto.RefreshTokenRequest;
import com.company.placement.auth.dto.RefreshTokenResponse;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationMs", 604800000L);
        ReflectionTestUtils.setField(authService, "accessTokenExpirationMs", 900000L);

        testUser = User.builder()
                .email("test@company.com")
                .fullName("Test User")
                .passwordHash("encodedPassword")
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .forcePasswordChange(true)
                .build();
        testUser.setId(userId);
    }

    @Test
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("test@company.com")
                .password("rawPassword")
                .build();

        when(userRepository.findByEmailIgnoreCase("test@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(any())).thenReturn("jwt.token.here");

        LoginResponse response = authService.login(request, null);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("test@company.com", response.getUser().getEmail());
        assertTrue(response.getUser().isForcePasswordChange());

        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .email("test@company.com")
                .password("wrongPassword")
                .build();

        when(userRepository.findByEmailIgnoreCase("test@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class, () -> authService.login(request, null));
        assertEquals("INVALID_CREDENTIALS", ex.getErrorCode());
    }

    @Test
    void refresh_Success_RotatesToken() {
        RefreshToken storedToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .tokenHash("someHashedToken")
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHashAndRevokedFalse(any())).thenReturn(Optional.of(storedToken));
        when(jwtTokenProvider.generateAccessToken(any())).thenReturn("new.jwt.token");

        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("valid-raw-refresh-token")
                .build();

        RefreshTokenResponse response = authService.refresh(request, null);

        assertNotNull(response);
        assertEquals("new.jwt.token", response.getAccessToken());
        assertTrue(storedToken.isRevoked());
        verify(refreshTokenRepository).save(storedToken);
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("encodedPassword")
                .newPassword("NewSecretPass123!")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("encodedPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("NewSecretPass123!")).thenReturn("newEncodedHash");

        authService.changePassword(userId, request, null);

        assertEquals("newEncodedHash", testUser.getPasswordHash());
        assertEquals(false, testUser.isForcePasswordChange());
        verify(refreshTokenRepository).revokeAllForUser(userId);
    }
}
