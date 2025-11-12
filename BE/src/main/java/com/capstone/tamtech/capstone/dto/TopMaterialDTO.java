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
public class TopMaterialDTO {

    private Integer branchId;

    private String branchName;

    private List<MaterialUsage> topMaterials;

    private String message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MaterialUsage {
        private Integer materialId;
        private String materialName;
        private Double quantityUsed;
        private String unit;
    }
}
