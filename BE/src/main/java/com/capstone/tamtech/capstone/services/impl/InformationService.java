package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.entities.Information;
import com.capstone.tamtech.capstone.payload.request.InformationRequest;

public interface InformationService {
    Information addInformation(int customerId, InformationRequest request);
    Information updateInformation(int customerId, int informationId, InformationRequest request);
    void deleteInformation(int customerId, int informationId);
}


