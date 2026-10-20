package com.company.placement.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {

    @Query("SELECT a FROM Assessment a LEFT JOIN FETCH a.questions q LEFT JOIN FETCH q.question WHERE a.id = :id")
    Optional<Assessment> findByIdWithQuestions(@Param("id") UUID id);

    List<Assessment> findAllByOrderByCreatedAtDesc();

    List<Assessment> findByStatusOrderByCreatedAtDesc(AssessmentStatus status);

    @Query("SELECT a FROM Assessment a WHERE (a.batchId IS NULL OR a.batchId = :batchId) ORDER BY a.createdAt DESC")
    List<Assessment> findEligibleAssessments(@Param("batchId") UUID batchId);
}
