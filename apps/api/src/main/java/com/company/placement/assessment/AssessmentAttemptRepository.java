package com.company.placement.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, UUID> {

    Optional<AssessmentAttempt> findByAssessmentIdAndStudentId(UUID assessmentId, UUID studentId);

    List<AssessmentAttempt> findByStudentIdOrderByStartedAtDesc(UUID studentId);

    @Query("SELECT at FROM AssessmentAttempt at " +
           "JOIN FETCH at.student s " +
           "WHERE at.assessment.id = :assessmentId " +
           "ORDER BY at.score DESC, at.submittedAt ASC")
    List<AssessmentAttempt> findLeaderboardByAssessmentId(@Param("assessmentId") UUID assessmentId);

    @Query("SELECT at FROM AssessmentAttempt at " +
           "JOIN FETCH at.student s " +
           "WHERE at.assessment.id = :assessmentId " +
           "ORDER BY at.startedAt DESC")
    List<AssessmentAttempt> findRosterByAssessmentId(@Param("assessmentId") UUID assessmentId);
}
