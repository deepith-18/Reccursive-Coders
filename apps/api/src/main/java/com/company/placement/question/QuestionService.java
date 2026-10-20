package com.company.placement.question;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.question.dto.CreateQuestionRequest;
import com.company.placement.question.dto.CreateTestCaseRequest;
import com.company.placement.question.dto.QuestionResponse;
import com.company.placement.question.dto.QuestionSummaryResponse;
import com.company.placement.question.dto.TestCaseDto;
import com.company.placement.question.dto.UpdateQuestionRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface QuestionService {

    QuestionResponse createQuestion(CreateQuestionRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    Page<QuestionSummaryResponse> searchQuestions(QuestionStatus status, QuestionDifficulty difficulty, String tag, String search, Pageable pageable);

    QuestionResponse getQuestionById(UUID questionId, UserPrincipal principal);

    QuestionResponse getQuestionBySlug(String slug, UserPrincipal principal);

    QuestionResponse updateQuestion(UUID questionId, UpdateQuestionRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    void deleteQuestion(UUID questionId, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    TestCaseDto addTestCase(UUID questionId, CreateTestCaseRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    void deleteTestCase(UUID questionId, UUID testCaseId, UUID actorId, String actorEmail, HttpServletRequest httpRequest);
}
