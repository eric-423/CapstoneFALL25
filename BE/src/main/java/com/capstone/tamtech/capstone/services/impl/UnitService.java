package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.UnitDTO;
import com.capstone.tamtech.capstone.payload.request.UnitRequest;

import java.util.List;

public interface UnitService {
    UnitDTO createUnit(UnitRequest request);

    UnitDTO updateUnit(int id, UnitRequest request);

    UnitDTO getUnitById(int id);

    List<UnitDTO> getAllUnits();

    void deleteUnit(int id);
}
