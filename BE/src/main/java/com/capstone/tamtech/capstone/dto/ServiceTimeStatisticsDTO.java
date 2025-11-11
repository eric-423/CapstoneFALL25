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
public class ServiceTimeStatisticsDTO {

    private Date currentDate;

    private Date comparisonDate;

    private Double averageServiceTimeMinutes;

    private Double comparisonAverageServiceTimeMinutes;

    private Double differenceMinutes;

    private Double percentageChange;

    private Integer totalOrdersProcessed;

    private Integer comparisonOrdersProcessed;

    private String comparisonType;

    private String message;
}
