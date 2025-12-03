package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardKPIDTO {
    private String label;
    private Double value;
    private String unit;
    private Double percentChange;
    private String trend;
}
