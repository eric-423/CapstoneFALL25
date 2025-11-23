package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CookingMethodDTO;
import com.capstone.tamtech.capstone.entities.CookingMethod;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.CookingMethodRequest;
import com.capstone.tamtech.capstone.repositories.CookingMethodRepository;
import com.capstone.tamtech.capstone.services.impl.CookingMehodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CookingMethodServiceImpl implements CookingMehodService {

    @Autowired
    private CookingMethodRepository cookingMethodRepository;


    @Override
    public CookingMethodDTO createCookingMethod(CookingMethodRequest cookingMethodRequest) {
        CookingMethod cookingMethod = new CookingMethod();
        cookingMethod.setName(cookingMethodRequest.getName());
        cookingMethod.setDescription(cookingMethodRequest.getDescription());

        cookingMethodRepository.save(cookingMethod);
        return mapToDTO(cookingMethod);
    }

    private CookingMethodDTO mapToDTO(CookingMethod cookingMethod) {
        CookingMethodDTO cookingMethodDTO = new CookingMethodDTO();
        cookingMethodDTO.setId(cookingMethod.getId());
        cookingMethodDTO.setName(cookingMethod.getName());
        cookingMethodDTO.setDescription(cookingMethod.getDescription());
        return cookingMethodDTO;
    }

    @Override
    public CookingMethodDTO updateCookingMethod(int id, CookingMethodRequest cookingMethodRequest) {
        CookingMethod cookingMethod = cookingMethodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cooking Method not found"));
        cookingMethod.setDescription(cookingMethodRequest.getDescription());
        cookingMethod.setName(cookingMethodRequest.getName());
        cookingMethodRepository.save(cookingMethod);
        return mapToDTO(cookingMethod);
    }

    @Override
    public CookingMethodDTO getCookingMethodById(int id) {
        CookingMethod cookingMethod = cookingMethodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cooking Method not found"));
        return mapToDTO(cookingMethod);
    }

    @Override
    public List<CookingMethodDTO> getAllCookingMethods() {
        List<CookingMethod> cookingMethods = cookingMethodRepository.findAll();
        return cookingMethods.stream().map(this::mapToDTO).toList();
    }
}
