package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;

import java.util.List;

public interface NutrientService {
    NutrientDTO createNutrient(NutrientRequest request);

    NutrientDTO updateNutrient(int id, NutrientRequest request);

    NutrientDTO getNutrientById(int id);

    List<NutrientDTO> getAllNutrients();

    void deleteNutrient(int id);
}
