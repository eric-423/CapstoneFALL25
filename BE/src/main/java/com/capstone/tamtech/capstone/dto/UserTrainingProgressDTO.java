package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTrainingProgressDTO {
    private Integer totalLessons;
    private Integer completedLessons;
    private Integer trainingPoint;
    private Integer earnedPoints;
    private Double completionPercent;
    private Boolean isPassed;
}
