package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.CookingMethodDTO;
import com.capstone.tamtech.capstone.payload.request.CookingMethodRequest;
import java.util.List;

public interface CookingMehodService {
    CookingMethodDTO createCookingMethod(CookingMethodRequest cookingMethodRequest);
    CookingMethodDTO updateCookingMethod(int idm , CookingMethodRequest cookingMethodRequest);
    CookingMethodDTO getCookingMethodById(int id);
    List<CookingMethodDTO> getAllCookingMethods();
}
