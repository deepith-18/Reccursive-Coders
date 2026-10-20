package com.company.placement.placement;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.placement.dto.*;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfile;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlacementServiceImpl implements PlacementService {

    private final PlacementDriveRepository driveRepository;
    private final PlacementApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementDriveResponse> getAllDrives(DriveStatus status, String search, Pageable pageable, UserPrincipal principal) {
        Page<PlacementDrive> drives = driveRepository.searchDrives(status, search, pageable);

        StudentProfile studentProfile = null;
        if (principal != null && principal.getRole() == Role.STUDENT) {
            studentProfile = studentProfileRepository.findByUserId(principal.getId()).orElse(null);
        }

        final StudentProfile finalProfile = studentProfile;
        return drives.map(drive -> toResponse(drive, principal != null ? principal.getId() : null, finalProfile));
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementDriveResponse getDriveById(UUID driveId, UserPrincipal principal) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        StudentProfile studentProfile = null;
        if (principal != null && principal.getRole() == Role.STUDENT) {
            studentProfile = studentProfileRepository.findByUserId(principal.getId()).orElse(null);
        }

        return toResponse(drive, principal != null ? principal.getId() : null, studentProfile);
    }

    @Override
    @Transactional
    public PlacementDriveResponse createDrive(CreatePlacementDriveRequest request, UserPrincipal principal) {
        User creator = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        PlacementDrive drive = PlacementDrive.builder()
                .title(request.getTitle())
                .companyName(request.getCompanyName())
                .companyLogoUrl(request.getCompanyLogoUrl())
                .jobRole(request.getJobRole())
                .description(request.getDescription())
                .packageCtcLpa(request.getPackageCtcLpa())
                .location(request.getLocation() != null ? request.getLocation() : "Bengaluru, India")
                .minCgpa(request.getMinCgpa())
                .eligibleBranches(request.getEligibleBranches())
                .minCodingScore(request.getMinCodingScore())
                .driveDate(request.getDriveDate())
                .applicationDeadline(request.getApplicationDeadline())
                .status(request.getStatus() != null ? request.getStatus() : DriveStatus.OPEN)
                .openingsCount(request.getOpeningsCount() != null ? request.getOpeningsCount() : 5)
                .creator(creator)
                .build();

        PlacementDrive saved = driveRepository.save(drive);
        log.info("Created placement drive: {} at {} by {}", saved.getTitle(), saved.getCompanyName(), creator.getEmail());
        return toResponse(saved, null, null);
    }

    @Override
    @Transactional
    public PlacementDriveResponse updateDrive(UUID driveId, CreatePlacementDriveRequest request) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        drive.setTitle(request.getTitle());
        drive.setCompanyName(request.getCompanyName());
        if (request.getCompanyLogoUrl() != null) drive.setCompanyLogoUrl(request.getCompanyLogoUrl());
        drive.setJobRole(request.getJobRole());
        drive.setDescription(request.getDescription());
        drive.setPackageCtcLpa(request.getPackageCtcLpa());
        if (request.getLocation() != null) drive.setLocation(request.getLocation());
        drive.setMinCgpa(request.getMinCgpa());
        drive.setEligibleBranches(request.getEligibleBranches());
        drive.setMinCodingScore(request.getMinCodingScore());
        drive.setDriveDate(request.getDriveDate());
        drive.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null) drive.setStatus(request.getStatus());
        if (request.getOpeningsCount() != null) drive.setOpeningsCount(request.getOpeningsCount());

        PlacementDrive saved = driveRepository.save(drive);
        return toResponse(saved, null, null);
    }

    @Override
    @Transactional
    public PlacementApplicationResponse applyToDrive(UUID driveId, UserPrincipal principal) {
        if (principal == null || principal.getRole() != Role.STUDENT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only students can apply to placement drives");
        }

        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        if (drive.getStatus() != DriveStatus.OPEN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "DRIVE_NOT_OPEN", "This placement drive is not open for applications");
        }

        if (drive.getApplicationDeadline().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "DEADLINE_PASSED", "Application deadline has already passed");
        }

        if (applicationRepository.existsByDriveIdAndStudentId(driveId, principal.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "ALREADY_APPLIED", "You have already applied to this placement drive");
        }

        User student = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        StudentProfile profile = studentProfileRepository.findByUserId(principal.getId()).orElse(null);

        // Check minimum CGPA if required
        if (drive.getMinCgpa() != null && profile != null && profile.getCgpa() != null) {
            if (profile.getCgpa().doubleValue() < drive.getMinCgpa()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INELIGIBLE_CGPA",
                        "Your CGPA (" + profile.getCgpa() + ") does not meet the minimum requirement of " + drive.getMinCgpa());
            }
        }

        // Check coding score if required
        if (drive.getMinCodingScore() != null && profile != null && profile.getTotalScore() != null) {
            if (profile.getTotalScore() < drive.getMinCodingScore()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INELIGIBLE_SCORE",
                        "Your platform coding score (" + profile.getTotalScore() + ") is below the required " + drive.getMinCodingScore());
            }
        }

        PlacementApplication application = PlacementApplication.builder()
                .drive(drive)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(Instant.now())
                .resumeUrl(profile != null ? profile.getResumeFileName() : null)
                .build();

        PlacementApplication saved = applicationRepository.save(application);
        log.info("Student {} applied to drive {}", student.getEmail(), drive.getTitle());
        return toApplicationResponse(saved, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementApplicationResponse> getMyApplications(UserPrincipal principal) {
        if (principal == null) return List.of();
        List<PlacementApplication> applications = applicationRepository.findByStudentIdOrderByAppliedAtDesc(principal.getId());
        StudentProfile profile = studentProfileRepository.findByUserId(principal.getId()).orElse(null);
        return applications.stream()
                .map(app -> toApplicationResponse(app, profile))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementApplicationResponse> getDriveApplications(UUID driveId, Pageable pageable) {
        Page<PlacementApplication> page = applicationRepository.findByDriveIdOrderByAppliedAtDesc(driveId, pageable);
        return page.map(app -> {
            StudentProfile profile = studentProfileRepository.findByUserId(app.getStudent().getId()).orElse(null);
            return toApplicationResponse(app, profile);
        });
    }

    @Override
    @Transactional
    public PlacementApplicationResponse updateApplicationStatus(UUID applicationId, UpdateApplicationStatusRequest request) {
        PlacementApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementApplication", "id", applicationId));

        app.setStatus(request.getStatus());
        if (request.getRecruiterNotes() != null) app.setRecruiterNotes(request.getRecruiterNotes());
        if (request.getInterviewDate() != null) app.setInterviewDate(request.getInterviewDate());
        if (request.getOfferedCtcLpa() != null) app.setOfferedCtcLpa(request.getOfferedCtcLpa());

        PlacementApplication saved = applicationRepository.save(app);
        StudentProfile profile = studentProfileRepository.findByUserId(saved.getStudent().getId()).orElse(null);
        return toApplicationResponse(saved, profile);
    }

    private PlacementDriveResponse toResponse(PlacementDrive drive, UUID studentId, StudentProfile profile) {
        long count = applicationRepository.countByDriveId(drive.getId());
        boolean applied = studentId != null && applicationRepository.existsByDriveIdAndStudentId(drive.getId(), studentId);

        boolean eligible = true;
        StringBuilder reason = new StringBuilder();

        if (profile != null) {
            if (drive.getMinCgpa() != null && profile.getCgpa() != null) {
                if (profile.getCgpa().doubleValue() < drive.getMinCgpa()) {
                    eligible = false;
                    reason.append("CGPA ").append(profile.getCgpa()).append(" < required ").append(drive.getMinCgpa()).append(". ");
                }
            }
            if (drive.getMinCodingScore() != null && profile.getTotalScore() != null) {
                if (profile.getTotalScore() < drive.getMinCodingScore()) {
                    eligible = false;
                    reason.append("Score ").append(profile.getTotalScore()).append(" < required ").append(drive.getMinCodingScore()).append(". ");
                }
            }
        }

        return PlacementDriveResponse.builder()
                .id(drive.getId())
                .title(drive.getTitle())
                .companyName(drive.getCompanyName())
                .companyLogoUrl(drive.getCompanyLogoUrl())
                .jobRole(drive.getJobRole())
                .description(drive.getDescription())
                .packageCtcLpa(drive.getPackageCtcLpa())
                .location(drive.getLocation())
                .minCgpa(drive.getMinCgpa())
                .eligibleBranches(drive.getEligibleBranches())
                .minCodingScore(drive.getMinCodingScore())
                .driveDate(drive.getDriveDate())
                .applicationDeadline(drive.getApplicationDeadline())
                .status(drive.getStatus())
                .openingsCount(drive.getOpeningsCount())
                .applicantCount(count)
                .isApplied(applied)
                .isEligible(eligible)
                .eligibilityReason(reason.length() > 0 ? reason.toString() : "Fully Eligible")
                .createdAt(drive.getCreatedAt())
                .build();
    }

    private PlacementApplicationResponse toApplicationResponse(PlacementApplication app, StudentProfile profile) {
        return PlacementApplicationResponse.builder()
                .id(app.getId())
                .driveId(app.getDrive().getId())
                .driveTitle(app.getDrive().getTitle())
                .companyName(app.getDrive().getCompanyName())
                .companyLogoUrl(app.getDrive().getCompanyLogoUrl())
                .jobRole(app.getDrive().getJobRole())
                .packageCtcLpa(app.getDrive().getPackageCtcLpa())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getFullName())
                .studentEmail(app.getStudent().getEmail())
                .studentPhone(app.getStudent().getPhone())
                .collegeName(profile != null ? profile.getCollege() : null)
                .branch(profile != null ? profile.getBranch() : null)
                .cgpa(profile != null && profile.getCgpa() != null ? profile.getCgpa().doubleValue() : null)
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .recruiterNotes(app.getRecruiterNotes())
                .interviewDate(app.getInterviewDate())
                .offeredCtcLpa(app.getOfferedCtcLpa())
                .build();
    }
}
