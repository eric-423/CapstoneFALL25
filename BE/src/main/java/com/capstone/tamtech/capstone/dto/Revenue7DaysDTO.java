package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Revenue7DaysDTO {

    private Integer branchId;

    private String branchName;

    private List<DailyRevenue> dailyRevenues;

    private Double totalRevenue;

    private Double averageRevenue;

    private String message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyRevenue {
        private String date;
        private Double revenue;
        private Integer orderCount;
    }
}
