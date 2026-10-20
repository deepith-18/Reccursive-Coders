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
public class DailyHeatmapDto {
    private LocalDate date;
    private int count;
    private int problemsSolved;
    private int pointsEarned;
    private int level;
}
