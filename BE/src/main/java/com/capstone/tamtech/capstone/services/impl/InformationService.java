package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.InformationDTO;
import com.capstone.tamtech.capstone.entities.Information;
import com.capstone.tamtech.capstone.payload.request.InformationRequest;

import java.util.List;

public interface InformationService {
    Information addInformation(int customerId, InformationRequest request);

    Information updateInformation(int customerId, int informationId, InformationRequest request);

    void deleteInformation(int customerId, int informationId);

    InformationDTO getInformation(int customerId, int informationId);

    List<InformationDTO> getAllInformations(int customerId);
}
