package com.company.placement.assignment;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.assignment.dto.AssignmentResponse;
import com.company.placement.assignment.dto.AssignmentSummaryResponse;
import com.company.placement.assignment.dto.CreateAssignmentRequest;
import com.company.placement.assignment.dto.UpdateAssignmentRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface AssignmentService {

    AssignmentResponse createAssignment(CreateAssignmentRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    List<AssignmentSummaryResponse> getAssignmentsByBatch(UUID batchId, UserPrincipal principal);

    List<AssignmentSummaryResponse> getMyAssignments(UserPrincipal principal);

    AssignmentResponse getAssignmentById(UUID assignmentId, UserPrincipal principal);

    AssignmentResponse updateAssignment(UUID assignmentId, UpdateAssignmentRequest request, UUID actorId, String actorEmail, HttpServletRequest httpRequest);

    void deleteAssignment(UUID assignmentId, UUID actorId, String actorEmail, HttpServletRequest httpRequest);
}
