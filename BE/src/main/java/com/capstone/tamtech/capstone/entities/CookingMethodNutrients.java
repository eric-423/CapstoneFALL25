package com.capstone.tamtech.capstone.entities;

import com.capstone.tamtech.capstone.entities.keys.KeyCookingMethodNutrients;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cooking_method_nutrients")
@Entity
@Data
public class CookingMethodNutrients {

    @EmbeddedId
    private KeyCookingMethodNutrients keyCookingMethodNutrients;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "cooking_method_id", insertable = false, updatable = false)
    private CookingMethod cookingMethod;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "nutrient_id", insertable = false, updatable = false)
    private Nutrients nutrient;

    @Column(name = "retention_factor")
    private Double retentionFactor;
}
