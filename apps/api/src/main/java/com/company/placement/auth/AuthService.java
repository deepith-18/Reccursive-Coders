package com.company.placement.auth;

import com.company.placement.auth.dto.ChangePasswordRequest;
import com.company.placement.auth.dto.LoginRequest;
import com.company.placement.auth.dto.LoginResponse;
import com.company.placement.auth.dto.RefreshTokenRequest;
import com.company.placement.auth.dto.RefreshTokenResponse;
import com.company.placement.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.UUID;

public interface AuthService {

    LoginResponse login(LoginRequest request, HttpServletRequest httpRequest);

    RefreshTokenResponse refresh(RefreshTokenRequest request, HttpServletRequest httpRequest);

    void logout(RefreshTokenRequest request, HttpServletRequest httpRequest);

    void changePassword(UUID userId, ChangePasswordRequest request, HttpServletRequest httpRequest);

    UserResponse getCurrentUser(UUID userId);
}
