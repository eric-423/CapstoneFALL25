package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ShiftDTO;
import com.capstone.tamtech.capstone.payload.request.ShiftRequest;

import java.util.List;

public interface ShiftService {

    List<ShiftDTO> getAllShifts(Integer branchId);

    ShiftDTO getShiftById(int id);

    ShiftDTO createShift(ShiftRequest request);

    ShiftDTO updateShift(int id, ShiftRequest request);
}


