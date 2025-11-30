package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MemberAssociationDTO;
import com.capstone.tamtech.capstone.entities.MemberAssociation;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.repositories.MemberAssociationRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.MemberAssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MemberAssociationServiceImpl implements MemberAssociationService {

    @Autowired
    private MemberAssociationRepository memberAssociationRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public MemberAssociationDTO getMemberAssociationsByCustomer(int customerId) {
        MemberAssociation memberAssociation = memberAssociationRepository.findByMembers_Id(customerId);
        if (memberAssociation != null) {
            return toDTO(memberAssociation);
        }
        return null;
    }

    @Override
    public MemberAssociationDTO getMemberAssociationsById(int id) {
        MemberAssociation memberAssociation = memberAssociationRepository.findById(id).orElse(null);
        if (memberAssociation != null) {
            return toDTO(memberAssociation);
        }
        return null;
    }

    @Override
    @Transactional
    public void updateMemberAssiociationForCustomer(int customerId) {
        Users customer = usersRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        int customerPoints = customer.getMemberPoint();

        Pageable pageable = PageRequest.of(0, 1);
        List<MemberAssociation> tiers = memberAssociationRepository
                .findByPointLessThanEqualOrderByPointDesc(customerPoints, pageable);

        if (tiers.isEmpty()) {
            throw new RuntimeException("No member association tier found for points: " + customerPoints);
        }

        MemberAssociation appropriateTier = tiers.get(0);

        customer.setMemberAssociation(appropriateTier);
        usersRepository.save(customer);
    }

    private MemberAssociationDTO toDTO(MemberAssociation memberAssociation) {
        MemberAssociationDTO dto = new MemberAssociationDTO();
        dto.setId(memberAssociation.getId());
        dto.setPoint(memberAssociation.getPoint());
        dto.setName(memberAssociation.getName());
        dto.setDescription(memberAssociation.getDescription());
        return dto;
    }
}
