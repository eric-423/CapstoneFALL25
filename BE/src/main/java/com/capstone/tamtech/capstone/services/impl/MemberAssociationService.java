package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MemberAssociationDTO;

public interface MemberAssociationService {
    MemberAssociationDTO getMemberAssociationsByCustomer(int customerId);

    MemberAssociationDTO getMemberAssociationsById(int id);

    void updateMemberAssiociationForCustomer(int customerId);
}
