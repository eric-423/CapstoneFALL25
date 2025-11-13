package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ComboDTO;
import com.capstone.tamtech.capstone.dto.ComboSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ComboSearchRequest;
import com.capstone.tamtech.capstone.payload.request.CreateComboRequest;
import com.capstone.tamtech.capstone.payload.request.UpdateComboRequest;

public interface ComboService {

    PagedResponse<ComboSearchDTO> searchCombos(ComboSearchRequest searchRequest);

    ComboDTO createCombo(CreateComboRequest request);

    ComboDTO updateCombo(int comboId, UpdateComboRequest request);

    void deleteCombo(int comboId);

    ComboDTO getComboById(int comboId);
}
