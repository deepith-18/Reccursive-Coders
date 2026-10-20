package com.company.placement.placement;

import com.company.placement.auth.UserPrincipal;
import com.company.placement.placement.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PlacementService {

    Page<PlacementDriveResponse> getAllDrives(DriveStatus status, String search, Pageable pageable, UserPrincipal principal);

    PlacementDriveResponse getDriveById(UUID driveId, UserPrincipal principal);

    PlacementDriveResponse createDrive(CreatePlacementDriveRequest request, UserPrincipal principal);

    PlacementDriveResponse updateDrive(UUID driveId, CreatePlacementDriveRequest request);

    void deleteDrive(UUID driveId);

    PlacementApplicationResponse applyToDrive(UUID driveId, UserPrincipal principal);

    List<PlacementApplicationResponse> getMyApplications(UserPrincipal principal);

    Page<PlacementApplicationResponse> getDriveApplications(UUID driveId, Pageable pageable);

    PlacementApplicationResponse updateApplicationStatus(UUID applicationId, UpdateApplicationStatusRequest request);
}
