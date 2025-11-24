package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.CookingUtensilDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilRequest;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilSearchRequest;

public interface CookingUtensilService {

    PagedResponse<CookingUtensilDTO> getCookingUtensils(CookingUtensilSearchRequest searchRequest);

    CookingUtensilDTO getCookingUtensil(int id);

    CookingUtensilDTO createCookingUtensil(CookingUtensilRequest request);

    CookingUtensilDTO updateCookingUtensil(int id, CookingUtensilRequest request);

    void deleteCookingUtensil(int id);
}

