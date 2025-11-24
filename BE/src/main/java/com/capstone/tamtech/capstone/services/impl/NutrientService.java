package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;
import com.capstone.tamtech.capstone.payload.request.NutrientsSearchRequest;

import java.util.List;

public interface NutrientService {
    NutrientDTO createNutrient(NutrientRequest request);

    NutrientDTO updateNutrient(int id, NutrientRequest request);

    NutrientDTO getNutrientById(int id);

    PagedResponse<NutrientDTO> getAllNutrients(NutrientsSearchRequest searchRequest);

    void deleteNutrient(int id);
}
