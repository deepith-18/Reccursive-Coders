package com.company.placement.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BatchRepository extends JpaRepository<Batch, UUID> {

    @EntityGraph(attributePaths = {"trainer"})
    Optional<Batch> findById(UUID id);

    Optional<Batch> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    @Query("SELECT b FROM Batch b LEFT JOIN FETCH b.trainer WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:trainerId IS NULL OR (b.trainer IS NOT NULL AND b.trainer.id = :trainerId)) AND " +
           "(:query IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Batch> searchBatches(
            @Param("status") BatchStatus status,
            @Param("trainerId") UUID trainerId,
            @Param("query") String query,
            Pageable pageable
    );

    @Query("SELECT bs.batch FROM BatchStudent bs LEFT JOIN FETCH bs.batch.trainer " +
           "WHERE bs.student.id = :studentId AND bs.batch.status = 'ACTIVE' " +
           "ORDER BY bs.enrolledAt DESC")
    Page<Batch> findActiveBatchesByStudentId(@Param("studentId") UUID studentId, Pageable pageable);
}
