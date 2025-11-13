package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;

import java.util.List;

public interface MaterialTypeService {
    List<MaterialTypeDTO> getAllMaterialTypes(boolean includeDeleted);

    MaterialTypeDTO getMaterialTypeById(int id);

    MaterialTypeDTO createMaterialType(MaterialTypeDTO request);

    MaterialTypeDTO updateMaterialType(int id, MaterialTypeDTO request);

    void deleteMaterialType(int id);
}
