package com.company.placement.scoring;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyActivityRepository extends JpaRepository<DailyActivity, UUID> {

    Optional<DailyActivity> findByUserIdAndActivityDate(UUID userId, LocalDate activityDate);

    List<DailyActivity> findAllByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
            UUID userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT da FROM DailyActivity da WHERE da.user.id = :userId AND da.activityDate >= :sinceDate ORDER BY da.activityDate ASC")
    List<DailyActivity> findRecentActivitiesForUser(@Param("userId") UUID userId, @Param("sinceDate") LocalDate sinceDate);
}
