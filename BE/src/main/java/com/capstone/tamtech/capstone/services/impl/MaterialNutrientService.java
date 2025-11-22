package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialNutrientDTO;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientRequest;

import java.util.List;

public interface MaterialNutrientService {
    MaterialNutrientDTO createMaterialNutrient(MaterialNutrientRequest request);

    MaterialNutrientDTO updateMaterialNutrient(int materialId, int nutrientId, MaterialNutrientRequest request);

    MaterialNutrientDTO getMaterialNutrientById(int materialId, int nutrientId);

    List<MaterialNutrientDTO> getAllMaterialNutrients();

    void deleteMaterialNutrient(int materialId, int nutrientId);
}
