package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.PromotionTypeDTO;
import com.capstone.tamtech.capstone.entities.PromotionType;
import com.capstone.tamtech.capstone.repositories.PromotionTypeRepository;
import com.capstone.tamtech.capstone.services.impl.PromotionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionTypeServiceImpl implements PromotionTypeService {

    @Autowired
    private PromotionTypeRepository promotionTypeRepository;


    private PromotionTypeDTO toDTO(PromotionType promotionType) {
        PromotionTypeDTO dto = new PromotionTypeDTO();
        dto.setId(promotionType.getId());
        dto.setName(promotionType.getName());
        return dto;
    }

    @Override
    public List<PromotionTypeDTO> getAllPromotionTypes() {
        List<PromotionType> promotionTypes = promotionTypeRepository.findAll();

        return promotionTypes.stream().map(this::toDTO).toList();
    }
}
