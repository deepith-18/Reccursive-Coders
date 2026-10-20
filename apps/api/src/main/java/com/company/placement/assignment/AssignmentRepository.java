package com.company.placement.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    List<Assignment> findByBatchIdOrderByDueDateAsc(UUID batchId);

    List<Assignment> findByBatchIdInOrderByDueDateAsc(Collection<UUID> batchIds);

    @Query("SELECT a FROM Assignment a LEFT JOIN FETCH a.assignmentQuestions WHERE a.id = :id")
    Optional<Assignment> findByIdWithQuestions(@Param("id") UUID id);

    @Query("SELECT a FROM Assignment a WHERE a.batch.id IN :batchIds AND (:status IS NULL OR a.status = :status) ORDER BY a.dueDate ASC")
    List<Assignment> findByBatchIdsAndOptionalStatus(
            @Param("batchIds") Collection<UUID> batchIds,
            @Param("status") AssignmentStatus status
    );
}
