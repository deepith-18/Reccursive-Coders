package com.company.placement.scoring;

import com.company.placement.common.audit.BaseEntity;
import com.company.placement.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "daily_activities", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_activity_date", columnNames = {"user_id", "activity_date"})
})
public class DailyActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Builder.Default
    @Column(name = "problems_solved_count", nullable = false)
    private Integer problemsSolvedCount = 0;

    @Builder.Default
    @Column(name = "submissions_count", nullable = false)
    private Integer submissionsCount = 0;

    @Builder.Default
    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned = 0;
}
