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
public class NewCustomerStatisticsDTO {

    private Date currentDate;

    private Date comparisonDate;

    private Integer newCustomersToday;

    private Integer newCustomersComparison;

    private Integer difference;

    private Double percentageChange;

    private String comparisonType;

    private String message;
}
