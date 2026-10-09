package com.company.placement.user;

import com.company.placement.user.dto.BulkUploadResult;
import com.company.placement.user.dto.CreateUserRequest;
import com.company.placement.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserService {

    UserResponse createUser(CreateUserRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    BulkUploadResult bulkUploadStudents(MultipartFile file, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    Page<UserResponse> getUsers(Role role, UserStatus status, String query, Pageable pageable);

    UserResponse getUserById(UUID id);
}
