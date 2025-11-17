package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.MaterialRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialSearchRequest;

import java.util.List;

public interface MaterialService {
    PagedResponse<MaterialDTO> getAllMaterials(MaterialSearchRequest searchRequest);

    MaterialDTO getMaterialById(int id);

    MaterialDTO createMaterial(MaterialRequest request);

    MaterialDTO updateMaterial(int id, MaterialRequest request);

    void deleteMaterial(int id);
}
