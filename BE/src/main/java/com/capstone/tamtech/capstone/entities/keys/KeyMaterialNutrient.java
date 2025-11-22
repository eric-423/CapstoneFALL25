package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyMaterialNutrient implements Serializable {

    @Column(name = "material_id")
    private int materialId;

    @Column(name = "nutrient_id")
    private int nutrientId;
}
