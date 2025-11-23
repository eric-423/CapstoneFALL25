package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialNutrientDTO;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.MaterialNutrients;
import com.capstone.tamtech.capstone.entities.Nutrients;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialNutrient;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientRequest;
import com.capstone.tamtech.capstone.repositories.MaterialNutritionRepository;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.NutrientRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.services.impl.MaterialNutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialNutrientServiceImpl implements MaterialNutrientService {

    @Autowired
    private MaterialNutritionRepository materialNutritionRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private NutrientRepository nutrientRepository;

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private ProductServiceImpl productService;

    @Override
    public MaterialNutrientDTO createMaterialNutrient(MaterialNutrientRequest request) {
        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Material not found with id: " + request.getMaterialId()));

        Nutrients nutrient = nutrientRepository.findById(request.getNutrientId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Nutrient not found with id: " + request.getNutrientId()));

        KeyMaterialNutrient key = new KeyMaterialNutrient();
        key.setMaterialId(request.getMaterialId());
        key.setNutrientId(request.getNutrientId());

        MaterialNutrients materialNutrient = new MaterialNutrients();
        materialNutrient.setKeyMaterialNutrient(key);
        materialNutrient.setMaterial(material);
        materialNutrient.setNutrient(nutrient);
        materialNutrient.setState(request.getState());
        materialNutrient.setAmountPer100Unit(request.getAmountPer100Unit());

        materialNutritionRepository.save(materialNutrient);

        recalculateCaloriesForAffectedProducts(material.getId());

        return mapToDTO(materialNutrient);
    }

    @Override
    public MaterialNutrientDTO updateMaterialNutrient(int materialId, int nutrientId, MaterialNutrientRequest request) {
        KeyMaterialNutrient key = new KeyMaterialNutrient();
        key.setMaterialId(materialId);
        key.setNutrientId(nutrientId);

        MaterialNutrients materialNutrient = materialNutritionRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Material Nutrient not found"));

        materialNutrient.setState(request.getState());
        materialNutrient.setAmountPer100Unit(request.getAmountPer100Unit());

        materialNutritionRepository.save(materialNutrient);

        recalculateCaloriesForAffectedProducts(materialId);

        return mapToDTO(materialNutrient);
    }

    @Override
    public MaterialNutrientDTO getMaterialNutrientById(int materialId, int nutrientId) {
        KeyMaterialNutrient key = new KeyMaterialNutrient();
        key.setMaterialId(materialId);
        key.setNutrientId(nutrientId);

        MaterialNutrients materialNutrient = materialNutritionRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Material Nutrient not found"));
        return mapToDTO(materialNutrient);
    }

    @Override
    public List<MaterialNutrientDTO> getAllMaterialNutrients() {
        List<MaterialNutrients> materialNutrients = materialNutritionRepository.findAll();
        return materialNutrients.stream().map(this::mapToDTO).toList();
    }

    @Override
    public void deleteMaterialNutrient(int materialId, int nutrientId) {
        KeyMaterialNutrient key = new KeyMaterialNutrient();
        key.setMaterialId(materialId);
        key.setNutrientId(nutrientId);

        MaterialNutrients materialNutrient = materialNutritionRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Material Nutrient not found"));

        int affectedMaterialId = materialNutrient.getMaterial().getId();
        materialNutritionRepository.delete(materialNutrient);

        recalculateCaloriesForAffectedProducts(affectedMaterialId);
    }

    private void recalculateCaloriesForAffectedProducts(int materialId) {
        List<ProductRecipes> recipes = productRecipesRepository.findByMaterialId(materialId);
        recipes.stream()
                .map(recipe -> recipe.getProduct().getId())
                .distinct()
                .forEach(productService::reCalculateCaloriesForProduct);
    }

    private MaterialNutrientDTO mapToDTO(MaterialNutrients materialNutrient) {
        MaterialNutrientDTO dto = new MaterialNutrientDTO();
        dto.setMaterialId(materialNutrient.getMaterial().getId());
        dto.setMaterialName(materialNutrient.getMaterial().getName());
        dto.setNutrientId(materialNutrient.getNutrient().getId());
        dto.setNutrientName(materialNutrient.getNutrient().getName());
        dto.setState(materialNutrient.getState());
        dto.setAmountPer100Unit(materialNutrient.getAmountPer100Unit());
        return dto;
    }
}
