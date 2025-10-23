package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Embeddable
public class KeyProductRecipes {

    @Column(name = "product_id")
    private int productId;

    @Column(name = "material_id")
    private int materialId;
}
