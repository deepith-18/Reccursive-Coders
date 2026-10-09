package com.company.placement.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Student academic and placement profile response")
public class StudentProfileResponse {

    @Schema(description = "Profile ID")
    private UUID id;

    @Schema(description = "User ID")
    private UUID userId;

    @Schema(description = "Degree", example = "B.Tech Computer Science")
    private String degree;

    @Schema(description = "Academic branch", example = "Computer Science & Engineering")
    private String branch;

    @Schema(description = "College name", example = "National Institute of Technology")
    private String college;

    @Schema(description = "Graduation Year", example = "2026")
    private Integer graduationYear;

    @Schema(description = "Cumulative GPA", example = "8.75")
    private BigDecimal cgpa;

    @Schema(description = "List of technical skills")
    private List<String> skills;

    @Schema(description = "GitHub profile link", example = "https://github.com/alexsmith")
    private String githubUrl;

    @Schema(description = "LinkedIn profile link", example = "https://linkedin.com/in/alexsmith")
    private String linkedinUrl;

    @Schema(description = "Portfolio / personal website", example = "https://alexsmith.dev")
    private String portfolioUrl;

    @Schema(description = "Uploaded resume file name", example = "resume_alex.pdf")
    private String resumeFileName;

    @Schema(description = "Indicates if a resume document is on file", example = "true")
    private boolean hasResume;

    @Schema(description = "Calculated profile completion score (0-100)", example = "85")
    private int completionPercentage;

    @Schema(description = "Last profile update timestamp")
    private Instant updatedAt;
}
