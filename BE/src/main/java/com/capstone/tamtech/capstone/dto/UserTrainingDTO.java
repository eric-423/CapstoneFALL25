package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTrainingDTO {
    private Integer id;
    private Integer trainingId;
    private String trainingName;
    private Integer trainingPoint;
    private Integer userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    private Integer point;
    private Boolean isPassed;
    private Integer totalLessons;
    private Integer completedLessons;
    private Double completionPercent;
    private String status;
    private Date enrolledAt;
    private Date completedAt;
}
