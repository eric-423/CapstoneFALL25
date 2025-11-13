package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialWarehouseDTO {
    private int materialId;
    private String materialName;
    private String materialTypeName;
    private double quantity;
    private int warehouseId;
    private String warehouseAddress;
}
