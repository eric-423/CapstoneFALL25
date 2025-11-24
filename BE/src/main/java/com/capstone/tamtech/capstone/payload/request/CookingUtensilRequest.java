package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CookingUtensilRequest {
    private String name;
    private Integer quantity;
    private Integer utensilsTypeId;
    private Integer warehouseId;
}

