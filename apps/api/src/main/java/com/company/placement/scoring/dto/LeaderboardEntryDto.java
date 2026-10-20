package com.company.placement.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private long rank;
    private UUID userId;
    private String fullName;
    private String email;
    private String college;
    private Integer graduationYear;
    private int totalScore;
    private int problemsSolved;
    private int currentStreak;
    private int longestStreak;
}
