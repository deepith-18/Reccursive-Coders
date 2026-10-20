package com.company.placement.placement;

import com.company.placement.common.audit.BaseEntity;
import com.company.placement.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "placement_drives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementDrive extends BaseEntity {

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "company_logo_url", length = 512)
    private String companyLogoUrl;

    @Column(name = "job_role", nullable = false, length = 255)
    private String jobRole;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "package_ctc_lpa", precision = 5, scale = 2)
    private BigDecimal packageCtcLpa;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "min_cgpa")
    private Double minCgpa;

    @Column(name = "eligible_branches", length = 255)
    private String eligibleBranches;

    @Column(name = "min_coding_score")
    private Integer minCodingScore;

    @Column(name = "drive_date")
    private Instant driveDate;

    @Column(name = "application_deadline", nullable = false)
    private Instant applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private DriveStatus status = DriveStatus.OPEN;

    @Column(name = "openings_count")
    private Integer openingsCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @OneToMany(mappedBy = "drive", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PlacementApplication> applications = new ArrayList<>();
}
