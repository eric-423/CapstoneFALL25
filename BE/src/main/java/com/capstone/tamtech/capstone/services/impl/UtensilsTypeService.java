package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.UtensilsTypeDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeRequest;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeSearchRequest;

public interface UtensilsTypeService {

    PagedResponse<UtensilsTypeDTO> getUtensilsTypes(UtensilsTypeSearchRequest searchRequest);

    UtensilsTypeDTO getUtensilsType(int id);

    UtensilsTypeDTO createUtensilsType(UtensilsTypeRequest request);

    UtensilsTypeDTO updateUtensilsType(int id, UtensilsTypeRequest request);

    void deleteUtensilsType(int id);
}

