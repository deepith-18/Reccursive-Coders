package com.company.placement.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    @EntityGraph(attributePaths = {"user"})
    Optional<StudentProfile> findByUserId(UUID userId);

    @EntityGraph(attributePaths = {"user"})
    Page<StudentProfile> findAllByOrderByTotalScoreDescProblemsSolvedDescLongestStreakDesc(Pageable pageable);

    @Query("SELECT COUNT(sp) + 1 FROM StudentProfile sp WHERE sp.totalScore > :score OR (sp.totalScore = :score AND sp.problemsSolved > :solved)")
    long calculateGlobalRank(@Param("score") int score, @Param("solved") int solved);

    @Query("SELECT sp FROM StudentProfile sp JOIN com.company.placement.batch.BatchStudent bs ON bs.student.id = sp.user.id WHERE bs.batch.id = :batchId ORDER BY sp.totalScore DESC, sp.problemsSolved DESC, sp.longestStreak DESC")
    List<StudentProfile> findBatchLeaderboard(@Param("batchId") UUID batchId);
}

