package com.company.placement.assessment;

import com.company.placement.common.audit.BaseEntity;
import com.company.placement.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "assessment_attempts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"assessment_id", "student_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAttempt extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(name = "tab_switch_count", nullable = false)
    @Builder.Default
    private Integer tabSwitchCount = 0;

    @Column(name = "copy_paste_count", nullable = false)
    @Builder.Default
    private Integer copyPasteCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private AttemptStatus status = AttemptStatus.NOT_STARTED;

    @Column(name = "feedback_notes", columnDefinition = "TEXT")
    private String feedbackNotes;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;
}
