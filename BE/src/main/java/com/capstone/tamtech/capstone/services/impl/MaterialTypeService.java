package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeSearchRequest;

public interface MaterialTypeService {
    PagedResponse<MaterialTypeDTO> getAllMaterialTypes(MaterialTypeSearchRequest searchRequest);

    MaterialTypeDTO getMaterialTypeById(int id);

    MaterialTypeDTO createMaterialType(MaterialTypeRequest request);

    MaterialTypeDTO updateMaterialType(int id, MaterialTypeRequest request);

    void deleteMaterialType(int id);
}
