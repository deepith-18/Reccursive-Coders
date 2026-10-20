package com.company.placement.assessment;

import com.company.placement.common.audit.BaseEntity;
import com.company.placement.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "company_tag", length = 100)
    private String companyTag;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AssessmentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private AssessmentStatus status = AssessmentStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "proctoring_level", nullable = false, length = 50)
    @Builder.Default
    private ProctoringLevel proctoringLevel = ProctoringLevel.STRICT;

    @Column(name = "duration_minutes", nullable = false)
    @Builder.Default
    private Integer durationMinutes = 60;

    @Column(name = "max_violations_allowed", nullable = false)
    @Builder.Default
    private Integer maxViolationsAllowed = 3;

    @Column(name = "passing_score", nullable = false)
    @Builder.Default
    private Integer passingScore = 60;

    @Column(name = "total_points", nullable = false)
    @Builder.Default
    private Integer totalPoints = 100;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "ends_at")
    private Instant endsAt;

    @Column(name = "batch_id")
    private UUID batchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<AssessmentQuestion> questions = new ArrayList<>();

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AssessmentAttempt> attempts = new ArrayList<>();
}
