package com.capstone.tamtech.capstone.entities;

import com.capstone.tamtech.capstone.entities.keys.KeyMaterialNutrient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "material_nutrients")
@Data
public class MaterialNutrients {

    @EmbeddedId
    private KeyMaterialNutrient keyMaterialNutrient;

    @ManyToOne(cascade = { jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH })
    @JoinColumn(name = "material_id", insertable = false, updatable = false)
    private Material material;

    @ManyToOne(cascade = { jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH })
    @JoinColumn(name = "nutrient_id", insertable = false, updatable = false)
    private Nutrients nutrient;


    @Column(name = "amount_per_100_unit")
    private Double amountPer100Unit;

}
