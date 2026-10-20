package com.company.placement.placement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, UUID> {

    List<PlacementDrive> findByStatusOrderByApplicationDeadlineAsc(DriveStatus status);

    @Query("SELECT d FROM PlacementDrive d WHERE " +
           "(:status IS NULL OR d.status = :status) AND " +
           "(:search IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.jobRole) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PlacementDrive> searchDrives(
            @Param("status") DriveStatus status,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT COUNT(d) FROM PlacementDrive d WHERE d.status = 'OPEN' AND d.applicationDeadline > :now")
    long countActiveOpenDrives(@Param("now") Instant now);
}
