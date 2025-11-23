package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.entities.Nutrients;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;
import com.capstone.tamtech.capstone.repositories.NutrientRepository;
import com.capstone.tamtech.capstone.services.impl.NutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutrientServiceImpl implements NutrientService {

    @Autowired
    private NutrientRepository nutrientRepository;

    @Override
    public NutrientDTO createNutrient(NutrientRequest request) {
        Nutrients nutrient = new Nutrients();
        nutrient.setName(request.getName());
        nutrient.setCode(request.getCode());
        nutrient.setUnit(request.getUnit());
        nutrient.setEnergyPerUnit(request.getEnergyPerUnit());

        nutrientRepository.save(nutrient);
        return mapToDTO(nutrient);
    }

    @Override
    public NutrientDTO updateNutrient(int id, NutrientRequest request) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));

        nutrient.setName(request.getName());
        nutrient.setCode(request.getCode());
        nutrient.setUnit(request.getUnit());
        nutrient.setEnergyPerUnit(request.getEnergyPerUnit());

        nutrientRepository.save(nutrient);
        return mapToDTO(nutrient);
    }

    @Override
    public NutrientDTO getNutrientById(int id) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));
        return mapToDTO(nutrient);
    }

    @Override
    public List<NutrientDTO> getAllNutrients() {
        List<Nutrients> nutrients = nutrientRepository.findAll();
        return nutrients.stream().map(this::mapToDTO).toList();
    }

    @Override
    public void deleteNutrient(int id) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));
        nutrientRepository.delete(nutrient);
    }

    private NutrientDTO mapToDTO(Nutrients nutrient) {
        NutrientDTO dto = new NutrientDTO();
        dto.setId(nutrient.getId());
        dto.setName(nutrient.getName());
        dto.setCode(nutrient.getCode());
        dto.setUnit(nutrient.getUnit());
        dto.setEnergyPerUnit(nutrient.getEnergyPerUnit());
        return dto;
    }
}
