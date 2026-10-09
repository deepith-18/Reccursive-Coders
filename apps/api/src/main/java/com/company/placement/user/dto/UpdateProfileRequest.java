package com.company.placement.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload to update student academic and profile credentials")
public class UpdateProfileRequest {

    @Size(max = 100)
    @Schema(description = "Degree", example = "B.Tech Computer Science")
    private String degree;

    @Size(max = 100)
    @Schema(description = "Academic branch", example = "Computer Science & Engineering")
    private String branch;

    @Size(max = 200)
    @Schema(description = "College or university", example = "National Institute of Technology")
    private String college;

    @Min(value = 1990, message = "Graduation year must be valid")
    @Max(value = 2035, message = "Graduation year must be valid")
    @Schema(description = "Graduation Year", example = "2026")
    private Integer graduationYear;

    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    @Schema(description = "CGPA out of 10", example = "8.75")
    private BigDecimal cgpa;

    @Schema(description = "Technical skills array", example = "[\"Java\", \"Spring Boot\", \"React\", \"PostgreSQL\"]")
    private List<String> skills;

    @Size(max = 255)
    @Schema(description = "GitHub URL", example = "https://github.com/alexsmith")
    private String githubUrl;

    @Size(max = 255)
    @Schema(description = "LinkedIn URL", example = "https://linkedin.com/in/alexsmith")
    private String linkedinUrl;

    @Size(max = 255)
    @Schema(description = "Portfolio / Personal site", example = "https://alexsmith.dev")
    private String portfolioUrl;
}
