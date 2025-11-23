package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class KeyCookingMethodNutrients implements Serializable {

    @Column(name = "cooking_method_id")
    private int cookingMethodId;

    @Column(name = "nutrient_id")
    private int nutrientId;
}
