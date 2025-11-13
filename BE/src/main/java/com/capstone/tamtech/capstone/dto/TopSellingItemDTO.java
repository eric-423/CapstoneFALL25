package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopSellingItemDTO {

    private List<SellingItem> topItems;

    private String message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SellingItem {
        private String type;
        private Integer id;
        private String name;
        private Integer quantitySold;
        private Double revenue;
        private String imageUrl;
    }
}
