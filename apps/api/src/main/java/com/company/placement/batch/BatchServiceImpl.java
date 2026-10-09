package com.company.placement.batch;

import com.company.placement.batch.dto.BatchResponse;
import com.company.placement.batch.dto.BatchStudentResponse;
import com.company.placement.batch.dto.CreateBatchRequest;
import com.company.placement.batch.dto.UpdateBatchRequest;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.user.Role;
import com.company.placement.user.StudentProfile;
import com.company.placement.user.StudentProfileRepository;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.dto.StudentProfileResponse;
import com.company.placement.user.dto.UserResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final BatchRepository batchRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public BatchResponse createBatch(CreateBatchRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);

        if (batchRepository.existsByCodeIgnoreCase(request.getCode().trim())) {
            throw new ApiException(HttpStatus.CONFLICT, "BATCH_CODE_EXISTS", "A batch with code '" + request.getCode() + "' already exists");
        }

        User trainer = null;
        if (request.getTrainerId() != null) {
            trainer = userRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer user", "id", request.getTrainerId()));
            if (trainer.getRole() != Role.TRAINER && trainer.getRole() != Role.ADMIN) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "Assigned user must be a TRAINER or ADMIN");
            }
        }

        Batch batch = Batch.builder()
                .name(request.getName().trim())
                .code(request.getCode().trim().toUpperCase())
                .description(request.getDescription())
                .trainer(trainer)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : BatchStatus.ACTIVE)
                .build();

        Batch saved = batchRepository.save(batch);

        auditLogService.record(
                actorId,
                actorEmail,
                "BATCH_CREATED",
                "BATCH",
                saved.getId().toString(),
                String.format("Batch '%s' (%s) created", saved.getName(), saved.getCode()),
                clientIp
        );

        return mapToBatchResponse(saved, 0L);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BatchResponse> getBatches(BatchStatus status, UUID trainerId, String query, Pageable pageable) {
        String searchQuery = (query != null && !query.isBlank()) ? query.trim() : null;
        return batchRepository.searchBatches(status, trainerId, searchQuery, pageable)
                .map(batch -> {
                    long count = batchStudentRepository.countByBatchId(batch.getId());
                    return mapToBatchResponse(batch, count);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public BatchResponse getBatchById(UUID id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", id));
        long count = batchStudentRepository.countByBatchId(batch.getId());
        return mapToBatchResponse(batch, count);
    }

    @Override
    @Transactional
    public BatchResponse updateBatch(UUID id, UpdateBatchRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", id));

        if (request.getName() != null && !request.getName().isBlank()) {
            batch.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            batch.setDescription(request.getDescription());
        }
        if (request.getStartDate() != null) {
            batch.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            batch.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            batch.setStatus(request.getStatus());
        }
        if (request.getTrainerId() != null) {
            User trainer = userRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer user", "id", request.getTrainerId()));
            if (trainer.getRole() != Role.TRAINER && trainer.getRole() != Role.ADMIN) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "Assigned user must be a TRAINER or ADMIN");
            }
            batch.setTrainer(trainer);
        }

        Batch updated = batchRepository.save(batch);
        long count = batchStudentRepository.countByBatchId(updated.getId());

        auditLogService.record(
                actorId,
                actorEmail,
                "BATCH_UPDATED",
                "BATCH",
                updated.getId().toString(),
                String.format("Batch '%s' updated", updated.getName()),
                getClientIp(httpRequest)
        );

        return mapToBatchResponse(updated, count);
    }

    @Override
    @Transactional
    public BatchResponse assignTrainer(UUID id, UUID trainerId, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", id));

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer user", "id", trainerId));
        if (trainer.getRole() != Role.TRAINER && trainer.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "Assigned user must be a TRAINER or ADMIN");
        }

        batch.setTrainer(trainer);
        Batch updated = batchRepository.save(batch);
        long count = batchStudentRepository.countByBatchId(updated.getId());

        auditLogService.record(
                actorId,
                actorEmail,
                "TRAINER_ASSIGNED",
                "BATCH",
                updated.getId().toString(),
                String.format("Trainer '%s' assigned to batch '%s'", trainer.getEmail(), updated.getName()),
                getClientIp(httpRequest)
        );

        return mapToBatchResponse(updated, count);
    }

    @Override
    @Transactional
    public void enrollStudents(UUID batchId, List<UUID> studentIds, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", batchId));

        int addedCount = 0;
        for (UUID sId : studentIds) {
            if (batchStudentRepository.existsByBatchIdAndStudentId(batchId, sId)) {
                continue; // Already enrolled
            }

            Optional<User> studentOpt = userRepository.findById(sId);
            if (studentOpt.isPresent() && studentOpt.get().getRole() == Role.STUDENT) {
                BatchStudent enrollment = BatchStudent.builder()
                        .batch(batch)
                        .student(studentOpt.get())
                        .build();
                batchStudentRepository.save(enrollment);
                addedCount++;
            }
        }

        auditLogService.record(
                actorId,
                actorEmail,
                "STUDENTS_ENROLLED",
                "BATCH",
                batch.getId().toString(),
                String.format("Enrolled %d students into batch '%s'", addedCount, batch.getName()),
                getClientIp(httpRequest)
        );
    }

    @Override
    @Transactional
    public void removeStudent(UUID batchId, UUID studentId, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        if (!batchStudentRepository.existsByBatchIdAndStudentId(batchId, studentId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "ENROLLMENT_NOT_FOUND", "Student is not enrolled in this batch");
        }

        batchStudentRepository.deleteByBatchIdAndStudentId(batchId, studentId);

        auditLogService.record(
                actorId,
                actorEmail,
                "STUDENT_REMOVED",
                "BATCH",
                batchId.toString(),
                String.format("Student %s removed from batch %s", studentId, batchId),
                getClientIp(httpRequest)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BatchStudentResponse> getEnrolledStudents(UUID batchId, Pageable pageable) {
        if (!batchRepository.existsById(batchId)) {
            throw new ResourceNotFoundException("Batch", "id", batchId);
        }

        return batchStudentRepository.findEnrolledStudentsByBatchId(batchId, pageable)
                .map(bs -> {
                    User student = bs.getStudent();
                    StudentProfile profile = studentProfileRepository.findByUserId(student.getId()).orElse(null);
                    return BatchStudentResponse.builder()
                            .id(bs.getId())
                            .student(mapToUserResponse(student))
                            .profile(profile != null ? mapToStudentProfileResponse(profile) : null)
                            .enrolledAt(bs.getEnrolledAt())
                            .build();
                });
    }

    @Override
    @Transactional(readOnly = true)
    public BatchResponse getActiveBatchForStudent(UUID studentId) {
        Page<Batch> activeBatches = batchRepository.findActiveBatchesByStudentId(studentId, PageRequest.of(0, 1));
        if (activeBatches.isEmpty()) {
            return null;
        }
        Batch batch = activeBatches.getContent().get(0);
        long count = batchStudentRepository.countByBatchId(batch.getId());
        return mapToBatchResponse(batch, count);
    }

    private BatchResponse mapToBatchResponse(Batch batch, long count) {
        return BatchResponse.builder()
                .id(batch.getId())
                .name(batch.getName())
                .code(batch.getCode())
                .description(batch.getDescription())
                .trainer(batch.getTrainer() != null ? mapToUserResponse(batch.getTrainer()) : null)
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .status(batch.getStatus())
                .studentCount(count)
                .createdAt(batch.getCreatedAt())
                .build();
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

    private StudentProfileResponse mapToStudentProfileResponse(StudentProfile profile) {
        List<String> skillsList = parseSkills(profile.getSkills());
        return StudentProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .degree(profile.getDegree())
                .branch(profile.getBranch())
                .college(profile.getCollege())
                .graduationYear(profile.getGraduationYear())
                .cgpa(profile.getCgpa())
                .skills(skillsList)
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeFileName(profile.getResumeFileName())
                .hasResume(profile.getResumeFilePath() != null && !profile.getResumeFilePath().isBlank())
                .completionPercentage(calculateCompleteness(profile, skillsList))
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(skillsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Arrays.stream(skillsJson.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
    }

    private int calculateCompleteness(StudentProfile p, List<String> skills) {
        int score = 0;
        if (p.getDegree() != null && !p.getDegree().isBlank()) score += 15;
        if (p.getBranch() != null && !p.getBranch().isBlank()) score += 10;
        if (p.getCollege() != null && !p.getCollege().isBlank()) score += 15;
        if (p.getGraduationYear() != null) score += 10;
        if (p.getCgpa() != null) score += 15;
        if (skills != null && !skills.isEmpty()) score += 15;
        if (p.getGithubUrl() != null && !p.getGithubUrl().isBlank()) score += 10;
        if (p.getResumeFilePath() != null && !p.getResumeFilePath().isBlank()) score += 10;
        return Math.min(100, score);
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
