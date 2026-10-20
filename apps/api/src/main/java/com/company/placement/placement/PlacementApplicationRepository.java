package com.company.placement.placement;

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
public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, UUID> {

    List<PlacementApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);

    Page<PlacementApplication> findByDriveIdOrderByAppliedAtDesc(UUID driveId, Pageable pageable);

    Optional<PlacementApplication> findByDriveIdAndStudentId(UUID driveId, UUID studentId);

    boolean existsByDriveIdAndStudentId(UUID driveId, UUID studentId);

    long countByDriveId(UUID driveId);

    @Query("SELECT COUNT(a) FROM PlacementApplication a WHERE a.drive.id = :driveId AND a.status = :status")
    long countByDriveIdAndStatus(@Param("driveId") UUID driveId, @Param("status") ApplicationStatus status);
}
