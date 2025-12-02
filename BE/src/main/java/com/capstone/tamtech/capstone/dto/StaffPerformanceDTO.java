package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffPerformanceDTO {
    private String staffName;
    private Long ordersHandled;
    private Double avgRating;
}

