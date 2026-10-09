package com.company.placement.user;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    @EntityGraph(attributePaths = {"user"})
    Optional<StudentProfile> findByUserId(UUID userId);
}
