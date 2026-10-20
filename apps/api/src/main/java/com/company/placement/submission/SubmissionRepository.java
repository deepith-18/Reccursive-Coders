package com.company.placement.submission;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    Page<Submission> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Submission> findByUserIdAndQuestionIdOrderByCreatedAtDesc(UUID userId, UUID questionId, Pageable pageable);

    List<Submission> findByQuestionIdOrderByCreatedAtDesc(UUID questionId);

    List<Submission> findByAssignmentIdOrderByCreatedAtDesc(UUID assignmentId);

    long countByUserIdAndVerdict(UUID userId, SubmissionVerdict verdict);

    boolean existsByUserIdAndQuestionIdAndVerdict(UUID userId, UUID questionId, SubmissionVerdict verdict);
}
