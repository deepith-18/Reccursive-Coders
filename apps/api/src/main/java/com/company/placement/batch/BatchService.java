package com.company.placement.batch;

import com.company.placement.batch.dto.BatchResponse;
import com.company.placement.batch.dto.BatchStudentResponse;
import com.company.placement.batch.dto.CreateBatchRequest;
import com.company.placement.batch.dto.UpdateBatchRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface BatchService {

    BatchResponse createBatch(CreateBatchRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    Page<BatchResponse> getBatches(BatchStatus status, UUID trainerId, String query, Pageable pageable);

    BatchResponse getBatchById(UUID id);

    BatchResponse updateBatch(UUID id, UpdateBatchRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    BatchResponse assignTrainer(UUID id, UUID trainerId, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    void enrollStudents(UUID batchId, List<UUID> studentIds, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    void removeStudent(UUID batchId, UUID studentId, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    Page<BatchStudentResponse> getEnrolledStudents(UUID batchId, Pageable pageable);

    BatchResponse getActiveBatchForStudent(UUID studentId);
}
