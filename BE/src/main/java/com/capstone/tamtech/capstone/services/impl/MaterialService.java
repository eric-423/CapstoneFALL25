package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialDTO;
import com.capstone.tamtech.capstone.payload.request.MaterialRequest;

import java.util.List;

public interface MaterialService {
    List<MaterialDTO> getAllMaterials(boolean includeDeleted);

    MaterialDTO getMaterialById(int id);

    MaterialDTO createMaterial(MaterialRequest request);

    MaterialDTO updateMaterial(int id, MaterialRequest request);

    void deleteMaterial(int id);
}
