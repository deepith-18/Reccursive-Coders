package com.company.placement.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestion, UUID> {

    List<AssignmentQuestion> findByAssignmentIdOrderByOrderIndexAsc(UUID assignmentId);

    boolean existsByAssignmentIdAndQuestionId(UUID assignmentId, UUID questionId);

    void deleteByAssignmentIdAndQuestionId(UUID assignmentId, UUID questionId);

    void deleteByAssignmentId(UUID assignmentId);
}
