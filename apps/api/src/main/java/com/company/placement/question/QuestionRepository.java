package com.company.placement.question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    Optional<Question> findBySlug(String slug);

    boolean existsBySlugIgnoreCase(String slug);

    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.testCases WHERE q.id = :id")
    Optional<Question> findByIdWithTestCases(@Param("id") UUID id);

    @Query("SELECT q FROM Question q WHERE " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:difficulty IS NULL OR q.difficulty = :difficulty) AND " +
           "(:tag IS NULL OR LOWER(q.tags) LIKE LOWER(CONCAT('%', :tag, '%'))) AND " +
           "(:search IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(q.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Question> searchQuestions(
            @Param("status") QuestionStatus status,
            @Param("difficulty") QuestionDifficulty difficulty,
            @Param("tag") String tag,
            @Param("search") String search,
            Pageable pageable
    );
}
