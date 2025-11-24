package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMaterialToWarehouseRequest {
    private List<MaterialItem> materials;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialItem {
        private int materialId;
        private double quantity;
        private Double threshold;
    }
}
