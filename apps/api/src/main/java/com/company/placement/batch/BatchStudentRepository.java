package com.company.placement.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BatchStudentRepository extends JpaRepository<BatchStudent, UUID> {

    boolean existsByBatchIdAndStudentId(UUID batchId, UUID studentId);

    Optional<BatchStudent> findByBatchIdAndStudentId(UUID batchId, UUID studentId);

    long countByBatchId(UUID batchId);

    @Query("SELECT bs FROM BatchStudent bs " +
           "JOIN FETCH bs.student s " +
           "WHERE bs.batch.id = :batchId")
    Page<BatchStudent> findEnrolledStudentsByBatchId(@Param("batchId") UUID batchId, Pageable pageable);

    List<BatchStudent> findByStudentId(UUID studentId);

    void deleteByBatchIdAndStudentId(UUID batchId, UUID studentId);
}
