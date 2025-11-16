package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeRequest;

import java.util.List;

public interface MaterialTypeService {
    List<MaterialTypeDTO> getAllMaterialTypes(boolean includeDeleted);

    MaterialTypeDTO getMaterialTypeById(int id);

    MaterialTypeDTO createMaterialType(MaterialTypeRequest request);

    MaterialTypeDTO updateMaterialType(int id, MaterialTypeRequest request);

    void deleteMaterialType(int id);
}
