package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialNutrientDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientCreateRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientRequest;

import java.util.List;

public interface MaterialNutrientService {
    MaterialNutrientDTO createMaterialNutrient(MaterialNutrientCreateRequest request);

    MaterialNutrientDTO updateMaterialNutrient(int materialId, int nutrientId, MaterialNutrientRequest request);
    MaterialNutrientDTO updateMaterialWithManyNutrient(int materialId, MaterialNutrientRequest request);

    MaterialNutrientDTO getMaterialNutrientById(int materialId, int nutrientId);

    public PagedResponse<MaterialNutrientDTO> getAllMaterialNutrients(int materialId, int nutriendId, int page, int size, String sortDirection);

    void deleteMaterialNutrient(int materialId, int nutrientId);
}
