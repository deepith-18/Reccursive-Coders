package com.company.placement.user;

import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UpdateProfileRequest;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface StudentProfileService {

    StudentProfileResponse getProfile(UUID userId);

    StudentProfileResponse updateProfile(UUID userId, UpdateProfileRequest request);

    StudentProfileResponse uploadResume(UUID userId, MultipartFile file);

    Resource getResume(UUID userId);
}
