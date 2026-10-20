package com.company.placement.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, UUID> {

    List<TestCase> findByQuestionIdOrderByOrderIndexAsc(UUID questionId);

    List<TestCase> findByQuestionIdAndIsSampleTrueOrderByOrderIndexAsc(UUID questionId);

    long countByQuestionIdAndIsSampleFalse(UUID questionId);
}
