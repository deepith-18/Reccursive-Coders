package com.company.placement.scoring.dto;

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
public class StudentScoringOverviewDto {
    private long globalRank;
    private int totalScore;
    private int problemsSolved;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastActiveDate;
}
