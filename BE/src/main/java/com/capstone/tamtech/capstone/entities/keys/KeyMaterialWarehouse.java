package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyMaterialWarehouse {

    @Column(name = "material_id")
    private int materialId;

    @Column(name = "warehouse_id")
    private int warehouseId;

}
