package com.company.placement.question;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.common.audit.AuditLogService;
import com.company.placement.common.exceptions.ApiException;
import com.company.placement.common.exceptions.ResourceNotFoundException;
import com.company.placement.question.dto.CreateQuestionRequest;
import com.company.placement.question.dto.CreateTestCaseRequest;
import com.company.placement.question.dto.QuestionResponse;
import com.company.placement.question.dto.QuestionSummaryResponse;
import com.company.placement.question.dto.TestCaseDto;
import com.company.placement.question.dto.UpdateQuestionRequest;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private final QuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? slugify(request.getSlug())
                : slugify(request.getTitle());

        // Ensure unique slug
        String candidateSlug = slug;
        int counter = 1;
        while (questionRepository.existsBySlugIgnoreCase(candidateSlug)) {
            candidateSlug = slug + "-" + counter++;
        }
        slug = candidateSlug;

        User author = null;
        if (actorId != null) {
            author = userRepository.findById(actorId).orElse(null);
        }

        Question question = Question.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .description(request.getDescription().trim())
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : QuestionDifficulty.EASY)
                .tags(request.getTags() != null ? request.getTags().trim() : null)
                .timeLimitMs(request.getTimeLimitMs() != null ? request.getTimeLimitMs() : 1000)
                .memoryLimitMb(request.getMemoryLimitMb() != null ? request.getMemoryLimitMb() : 256)
                .status(request.getStatus() != null ? request.getStatus() : QuestionStatus.PUBLISHED)
                .starterCodeJava(request.getStarterCodeJava())
                .starterCodePython(request.getStarterCodePython())
                .starterCodeCpp(request.getStarterCodeCpp())
                .author(author)
                .build();

        if (request.getTestCases() != null) {
            for (int i = 0; i < request.getTestCases().size(); i++) {
                CreateTestCaseRequest tcReq = request.getTestCases().get(i);
                TestCase tc = TestCase.builder()
                        .question(question)
                        .inputData(tcReq.getInputData())
                        .expectedOutput(tcReq.getExpectedOutput())
                        .isSample(tcReq.getIsSample() != null && tcReq.getIsSample())
                        .explanation(tcReq.getExplanation())
                        .orderIndex(tcReq.getOrderIndex() != null ? tcReq.getOrderIndex() : i)
                        .build();
                question.getTestCases().add(tc);
            }
        }

        Question saved = questionRepository.save(question);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "QUESTION_CREATED", "QUESTION",
                saved.getId().toString(), "Created question: " + saved.getTitle(), clientIp);

        return mapToResponse(saved, false);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuestionSummaryResponse> searchQuestions(QuestionStatus status, QuestionDifficulty difficulty, String tag, String search, Pageable pageable) {
        Page<Question> questions = questionRepository.searchQuestions(
                status,
                difficulty,
                (tag != null && !tag.isBlank()) ? tag.trim() : null,
                (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        return questions.map(this::mapToSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(UUID questionId, UserPrincipal principal) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        boolean maskHidden = isStudent(principal);
        return mapToResponse(question, maskHidden);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionBySlug(String slug, UserPrincipal principal) {
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        boolean maskHidden = isStudent(principal);
        return mapToResponse(question, maskHidden);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        validateOwnershipOrAdmin(question, actorId);

        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String newSlug = slugify(request.getSlug());
            if (!newSlug.equalsIgnoreCase(question.getSlug()) && questionRepository.existsBySlugIgnoreCase(newSlug)) {
                throw new ApiException(HttpStatus.CONFLICT, "SLUG_ALREADY_EXISTS", "A question with slug '" + newSlug + "' already exists");
            }
            question.setSlug(newSlug);
        }

        question.setTitle(request.getTitle().trim());
        question.setDescription(request.getDescription().trim());
        question.setDifficulty(request.getDifficulty());
        question.setTags(request.getTags() != null ? request.getTags().trim() : null);
        question.setTimeLimitMs(request.getTimeLimitMs());
        question.setMemoryLimitMb(request.getMemoryLimitMb());
        question.setStatus(request.getStatus());
        question.setStarterCodeJava(request.getStarterCodeJava());
        question.setStarterCodePython(request.getStarterCodePython());
        question.setStarterCodeCpp(request.getStarterCodeCpp());

        Question updated = questionRepository.save(question);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "QUESTION_UPDATED", "QUESTION",
                updated.getId().toString(), "Updated question: " + updated.getTitle(), clientIp);

        return mapToResponse(updated, false);
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID questionId, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        validateOwnershipOrAdmin(question, actorId);

        questionRepository.delete(question);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "QUESTION_DELETED", "QUESTION",
                questionId.toString(), "Deleted question: " + question.getTitle(), clientIp);
    }

    @Override
    @Transactional
    public TestCaseDto addTestCase(UUID questionId, CreateTestCaseRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        validateOwnershipOrAdmin(question, actorId);

        int orderIndex = (request.getOrderIndex() != null)
                ? request.getOrderIndex()
                : question.getTestCases().size();

        TestCase testCase = TestCase.builder()
                .question(question)
                .inputData(request.getInputData())
                .expectedOutput(request.getExpectedOutput())
                .isSample(request.getIsSample() != null && request.getIsSample())
                .explanation(request.getExplanation())
                .orderIndex(orderIndex)
                .build();

        TestCase saved = testCaseRepository.save(testCase);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "TESTCASE_ADDED", "TEST_CASE",
                saved.getId().toString(), "Added test case to question: " + question.getTitle(), clientIp);

        return mapToTestCaseDto(saved);
    }

    @Override
    @Transactional
    public void deleteTestCase(UUID questionId, UUID testCaseId, UUID actorId, String actorEmail, HttpServletRequest httpRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        validateOwnershipOrAdmin(question, actorId);

        TestCase testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase", "id", testCaseId));

        if (!testCase.getQuestion().getId().equals(questionId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_TEST_CASE", "Test case does not belong to question");
        }

        testCaseRepository.delete(testCase);

        String clientIp = getClientIp(httpRequest);
        auditLogService.record(actorId, actorEmail, "TESTCASE_DELETED", "TEST_CASE",
                testCaseId.toString(), "Deleted test case from question: " + question.getTitle(), clientIp);
    }

    private void validateOwnershipOrAdmin(Question question, UUID actorId) {
        if (actorId == null) {
            return;
        }
        User actor = userRepository.findById(actorId).orElse(null);
        if (actor == null) {
            return;
        }
        if (actor.getRole() == Role.ADMIN) {
            return;
        }
        if (actor.getRole() == Role.TRAINER) {
            if (question.getAuthor() != null && !question.getAuthor().getId().equals(actorId)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN_OPERATION", "You are not authorized to modify questions authored by other trainers");
            }
            return;
        }
        throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN_OPERATION", "Students cannot modify questions");
    }

    private boolean isStudent(UserPrincipal principal) {
        if (principal == null) return false;
        return principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
    }

    private QuestionResponse mapToResponse(Question question, boolean maskHidden) {
        List<TestCase> allCases = question.getTestCases() != null ? question.getTestCases() : List.of();
        int totalCount = allCases.size();
        int hiddenCount = (int) allCases.stream().filter(tc -> !Boolean.TRUE.equals(tc.getIsSample())).count();

        List<TestCaseDto> caseDtos;
        if (maskHidden) {
            // Mask hidden test cases: students only see sample test cases
            caseDtos = allCases.stream()
                    .filter(tc -> Boolean.TRUE.equals(tc.getIsSample()))
                    .map(this::mapToTestCaseDto)
                    .collect(Collectors.toList());
        } else {
            caseDtos = allCases.stream()
                    .map(this::mapToTestCaseDto)
                    .collect(Collectors.toList());
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .slug(question.getSlug())
                .description(question.getDescription())
                .difficulty(question.getDifficulty())
                .tags(question.getTags())
                .timeLimitMs(question.getTimeLimitMs())
                .memoryLimitMb(question.getMemoryLimitMb())
                .status(question.getStatus())
                .starterCodeJava(question.getStarterCodeJava())
                .starterCodePython(question.getStarterCodePython())
                .starterCodeCpp(question.getStarterCodeCpp())
                .authorId(question.getAuthor() != null ? question.getAuthor().getId() : null)
                .authorName(question.getAuthor() != null ? question.getAuthor().getFullName() : null)
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .testCases(caseDtos)
                .totalTestCasesCount(totalCount)
                .hiddenTestCasesCount(hiddenCount)
                .build();
    }

    private QuestionSummaryResponse mapToSummaryResponse(Question question) {
        List<TestCase> testCases = question.getTestCases() != null ? question.getTestCases() : List.of();
        int total = testCases.size();
        int sample = (int) testCases.stream().filter(tc -> Boolean.TRUE.equals(tc.getIsSample())).count();

        return QuestionSummaryResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .slug(question.getSlug())
                .difficulty(question.getDifficulty())
                .tags(question.getTags())
                .status(question.getStatus())
                .timeLimitMs(question.getTimeLimitMs())
                .memoryLimitMb(question.getMemoryLimitMb())
                .authorId(question.getAuthor() != null ? question.getAuthor().getId() : null)
                .authorName(question.getAuthor() != null ? question.getAuthor().getFullName() : null)
                .sampleCasesCount(sample)
                .totalCasesCount(total)
                .createdAt(question.getCreatedAt())
                .build();
    }

    private TestCaseDto mapToTestCaseDto(TestCase tc) {
        return TestCaseDto.builder()
                .id(tc.getId())
                .inputData(tc.getInputData())
                .expectedOutput(tc.getExpectedOutput())
                .isSample(tc.getIsSample())
                .explanation(tc.getExplanation())
                .orderIndex(tc.getOrderIndex())
                .build();
    }

    private String slugify(String input) {
        if (input == null) return "";
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
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
