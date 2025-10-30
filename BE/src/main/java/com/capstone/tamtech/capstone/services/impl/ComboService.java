package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ComboSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ComboSearchRequest;

public interface ComboService {

    PagedResponse<ComboSearchDTO> searchCombos(ComboSearchRequest searchRequest);
}


