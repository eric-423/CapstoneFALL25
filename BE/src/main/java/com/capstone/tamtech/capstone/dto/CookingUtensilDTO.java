package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CookingUtensilDTO implements Serializable {
    private int id;
    private String name;
    private Integer quantity;
    private Integer utensilsTypeId;
    private String utensilsTypeName;
    private Integer warehouseId;
    private String warehouseName;
}

