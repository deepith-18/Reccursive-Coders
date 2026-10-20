package com.company.placement.user;

import com.company.placement.common.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profiles")
public class StudentProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "degree", length = 100)
    private String degree;

    @Column(name = "branch", length = 100)
    private String branch;

    @Column(name = "college", length = 200)
    private String college;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "cgpa", precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "resume_file_name")
    private String resumeFileName;

    @Column(name = "resume_file_path", length = 500)
    private String resumeFilePath;

    @Builder.Default
    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Builder.Default
    @Column(name = "problems_solved", nullable = false)
    private Integer problemsSolved = 0;

    @Builder.Default
    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Builder.Default
    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "last_active_date")
    private java.time.LocalDate lastActiveDate;
}
