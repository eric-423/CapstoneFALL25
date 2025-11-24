package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryDTO implements Serializable {
    private Integer userId;
    private String userName;
    private Integer branchId;
    private String branchName;
    private Integer totalWorkDays;
    private Integer totalWorkMinutes;
    private Double totalWorkHours;
    private Integer lateDays;
    private Integer absentDays;
    private Integer onTimeDays;
}
