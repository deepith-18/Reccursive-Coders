package com.company.placement.question.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseDto {
    private UUID id;
    private String inputData;
    private String expectedOutput;
    private Boolean isSample;
    private String explanation;
    private Integer orderIndex;
}
