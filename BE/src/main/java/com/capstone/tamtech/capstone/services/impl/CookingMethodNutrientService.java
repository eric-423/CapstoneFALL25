package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.CookingMethodNutrientDTO;
import com.capstone.tamtech.capstone.payload.request.CookingMethodNutrientRequest;

import java.util.List;

public interface CookingMethodNutrientService {
    CookingMethodNutrientDTO createCookingMethodNutrient(CookingMethodNutrientRequest request);

    CookingMethodNutrientDTO updateCookingMethodNutrient(int cookingMethodId, int nutrientId,
            CookingMethodNutrientRequest request);

    CookingMethodNutrientDTO getCookingMethodNutrientById(int cookingMethodId, int nutrientId);

    List<CookingMethodNutrientDTO> getAllCookingMethodNutrients();

    void deleteCookingMethodNutrient(int cookingMethodId, int nutrientId);
}
