package com.company.placement.assignment;

import com.company.placement.assignment.dto.AssignmentQuestionDto;
import com.company.placement.assignment.dto.AssignmentQuestionItemRequest;
import com.company.placement.assignment.dto.AssignmentResponse;
import com.company.placement.assignment.dto.AssignmentSummaryResponse;
import com.company.placement.assignment.dto.CreateAssignmentRequest;
import com.company.placement.assignment.dto.UpdateAssignmentRequest;
import com.company.placement.auth.UserPrincipal;
import com.company.placement.batch.Batch;
import com.company.placement.batch.BatchRepository;
import com.company.placement.batch.BatchStudent;
import com.company.placement.batch.BatchStudentRepository;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionRepository;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final BatchRepository batchRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public AssignmentResponse createAssignment(CreateAssignmentRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", request.getBatchId()));

        User author = null;
        if (actorId != null) {
            author = userRepository.findById(actorId).orElse(null);
            validateTrainerOrAdmin(batch, author);
        }

        Assignment assignment = Assignment.builder()
                .batch(batch)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .startDate(request.getStartDate() != null ? request.getStartDate() : Instant.now())
                .status(request.getStatus() != null ? request.getStatus() : AssignmentStatus.PUBLISHED)
                .author(author)
                .build();

        if (request.getQuestions() != null) {
            for (int i = 0; i < request.getQuestions().size(); i++) {
                AssignmentQuestionItemRequest qReq = request.getQuestions().get(i);
                Question question = questionRepository.findById(qReq.getQuestionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Question", "id", qReq.getQuestionId()));

                AssignmentQuestion aq = AssignmentQuestion.builder()
                        .assignment(assignment)
                        .question(question)
                        .points(qReq.getPoints() != null ? qReq.getPoints() : 10)
                        .orderIndex(qReq.getOrderIndex() != null ? qReq.getOrderIndex() : i)
                        .build();

                assignment.getAssignmentQuestions().add(aq);
            }
        }

        Assignment saved = assignmentRepository.save(assignment);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "ASSIGNMENT_CREATED", "ASSIGNMENT",
                saved.getId().toString(), "Created assignment: " + saved.getTitle() + " for batch " + batch.getCode(), clientIp);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentSummaryResponse> getAssignmentsByBatch(UUID batchId, UserPrincipal principal) {
        if (!batchRepository.existsById(batchId)) {
            throw new ResourceNotFoundException("Batch", "id", batchId);
        }

        if (isStudent(principal)) {
            boolean enrolled = batchStudentRepository.existsByBatchIdAndStudentId(batchId, principal.getId());
            if (!enrolled) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this batch");
            }
        }

        List<Assignment> assignments = assignmentRepository.findByBatchIdOrderByDueDateAsc(batchId);
        return assignments.stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentSummaryResponse> getMyAssignments(UserPrincipal principal) {
        if (principal == null) {
            return List.of();
        }

        List<BatchStudent> enrollments = batchStudentRepository.findByStudentId(principal.getId());
        if (enrollments.isEmpty()) {
            return List.of();
        }

        List<UUID> batchIds = enrollments.stream()
                .map(e -> e.getBatch().getId())
                .collect(Collectors.toList());

        List<Assignment> assignments = assignmentRepository.findByBatchIdsAndOptionalStatus(batchIds, null);
        return assignments.stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(UUID assignmentId, UserPrincipal principal) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        if (isStudent(principal)) {
            boolean enrolled = batchStudentRepository.existsByBatchIdAndStudentId(
                    assignment.getBatch().getId(), principal.getId());
            if (!enrolled) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this batch");
            }
        }

        return mapToResponse(assignment);
    }

    @Override
    @Transactional
    public AssignmentResponse updateAssignment(UUID assignmentId, UpdateAssignmentRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        validateTrainerOrAdmin(assignment.getBatch(), actor);

        assignment.setTitle(request.getTitle().trim());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        if (request.getStartDate() != null) {
            assignment.setStartDate(request.getStartDate());
        }
        assignment.setStatus(request.getStatus());

        if (request.getQuestions() != null) {
            assignment.getAssignmentQuestions().clear();
            for (int i = 0; i < request.getQuestions().size(); i++) {
                AssignmentQuestionItemRequest qReq = request.getQuestions().get(i);
                Question question = questionRepository.findById(qReq.getQuestionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Question", "id", qReq.getQuestionId()));

                AssignmentQuestion aq = AssignmentQuestion.builder()
                        .assignment(assignment)
                        .question(question)
                        .points(qReq.getPoints() != null ? qReq.getPoints() : 10)
                        .orderIndex(qReq.getOrderIndex() != null ? qReq.getOrderIndex() : i)
                        .build();

                assignment.getAssignmentQuestions().add(aq);
            }
        }

        Assignment updated = assignmentRepository.save(assignment);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "ASSIGNMENT_UPDATED", "ASSIGNMENT",
                updated.getId().toString(), "Updated assignment: " + updated.getTitle(), clientIp);

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAssignment(UUID assignmentId, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        validateTrainerOrAdmin(assignment.getBatch(), actor);

        assignmentRepository.delete(assignment);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "ASSIGNMENT_DELETED", "ASSIGNMENT",
                assignmentId.toString(), "Deleted assignment: " + assignment.getTitle(), clientIp);
    }

    private void validateTrainerOrAdmin(Batch batch, User actor) {
        if (actor == null) return;
        if (actor.getRole() == Role.ADMIN) return;
        if (actor.getRole() == Role.TRAINER) {
            // Trainers can manage assignments if they are batch trainer or general trainer
            return;
        }
        throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only trainers and admins can manage assignments");
    }

    private boolean isStudent(UserPrincipal principal) {
        if (principal == null) return false;
        return principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        List<AssignmentQuestion> aqList = assignment.getAssignmentQuestions() != null
                ? assignment.getAssignmentQuestions()
                : List.of();

        int totalPoints = aqList.stream().mapToInt(AssignmentQuestion::getPoints).sum();
        boolean isPastDue = assignment.getDueDate().isBefore(Instant.now());

        List<AssignmentQuestionDto> questions = aqList.stream().map(aq -> {
            Question q = aq.getQuestion();
            return AssignmentQuestionDto.builder()
                    .questionId(q.getId())
                    .title(q.getTitle())
                    .slug(q.getSlug())
                    .difficulty(q.getDifficulty())
                    .tags(q.getTags())
                    .points(aq.getPoints())
                    .orderIndex(aq.getOrderIndex())
                    .build();
        }).collect(Collectors.toList());

        return AssignmentResponse.builder()
                .id(assignment.getId())
                .batchId(assignment.getBatch().getId())
                .batchName(assignment.getBatch().getName())
                .batchCode(assignment.getBatch().getCode())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .startDate(assignment.getStartDate())
                .status(assignment.getStatus())
                .totalPoints(totalPoints)
                .questionCount(aqList.size())
                .isPastDue(isPastDue)
                .authorId(assignment.getAuthor() != null ? assignment.getAuthor().getId() : null)
                .authorName(assignment.getAuthor() != null ? assignment.getAuthor().getFullName() : null)
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .questions(questions)
                .build();
    }

    private AssignmentSummaryResponse mapToSummaryResponse(Assignment assignment) {
        List<AssignmentQuestion> aqList = assignment.getAssignmentQuestions() != null
                ? assignment.getAssignmentQuestions()
                : List.of();

        int totalPoints = aqList.stream().mapToInt(AssignmentQuestion::getPoints).sum();
        boolean isPastDue = assignment.getDueDate().isBefore(Instant.now());

        return AssignmentSummaryResponse.builder()
                .id(assignment.getId())
                .batchId(assignment.getBatch().getId())
                .batchName(assignment.getBatch().getName())
                .batchCode(assignment.getBatch().getCode())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .startDate(assignment.getStartDate())
                .status(assignment.getStatus())
                .totalPoints(totalPoints)
                .questionCount(aqList.size())
                .isPastDue(isPastDue)
                .authorId(assignment.getAuthor() != null ? assignment.getAuthor().getId() : null)
                .authorName(assignment.getAuthor() != null ? assignment.getAuthor().getFullName() : null)
                .createdAt(assignment.getCreatedAt())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
