package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialNutrientDTO;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.MaterialNutrients;
import com.capstone.tamtech.capstone.entities.Nutrients;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialNutrient;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientCreateRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientRequest;
import com.capstone.tamtech.capstone.repositories.MaterialNutritionRepository;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.NutrientRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.services.impl.MaterialNutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public MaterialNutrientDTO createMaterialNutrient(MaterialNutrientCreateRequest request) {
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

        materialNutrient.setAmountPer100Unit(request.getAmountPer100Unit());

        materialNutritionRepository.save(materialNutrient);

        recalculateCaloriesForAffectedProducts(materialId);

        return mapToDTO(materialNutrient);
    }

    @Override
    public MaterialNutrientDTO updateManyMaterialNutrient(int materialId, List<MaterialNutrientRequest> request) {
        List<MaterialNutrients> materialNutrients = materialNutritionRepository.findByMaterial_Id(materialId);
        materialNutritionRepository.deleteAll(materialNutrients);

        for(MaterialNutrientRequest item : request){
            MaterialNutrients materialNutrient = new MaterialNutrients();
            KeyMaterialNutrient key = new KeyMaterialNutrient();
            key.setMaterialId(materialId);
            key.setNutrientId(item.getNutrientId());
            materialNutrient.setKeyMaterialNutrient(key);
            materialNutrient.setAmountPer100Unit(item.getAmountPer100Unit());

            materialNutritionRepository.save(materialNutrient);
        }
        return null;
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
    public PagedResponse<MaterialNutrientDTO> getAllMaterialNutrients(int materialId, int nutriendId, int page, int size, String sortDirection) {
        Pageable pageable = createPageable(materialId, nutriendId, page, size, sortDirection);

        if(materialId==0 && nutriendId==0){
            Page<MaterialNutrients> materialNutrientsPage = materialNutritionRepository.findAll(pageable);
            List<MaterialNutrientDTO> content = materialNutrientsPage.stream().map(this::mapToDTO).toList();
            return createPagedResponse(materialNutrientsPage, content);
        }else if(materialId==0){
            Page<MaterialNutrients> materialNutrientsPage = materialNutritionRepository.findByNutrient_Id(materialId, pageable);
            List<MaterialNutrientDTO> content = materialNutrientsPage.stream().map(this::mapToDTO).toList();
            return createPagedResponse(materialNutrientsPage, content);
        } else if(nutriendId==0){
            Page<MaterialNutrients> materialNutrientsPage = materialNutritionRepository.findByMaterial_Id(materialId, pageable);
            List<MaterialNutrientDTO> content = materialNutrientsPage.stream().map(this::mapToDTO).toList();
            return createPagedResponse(materialNutrientsPage, content);
        } else {
            Page<MaterialNutrients> materialNutrientsPage = materialNutritionRepository.findByMaterial_IdAndNutrient_Id(materialId, nutriendId, pageable);
            List<MaterialNutrientDTO> content = materialNutrientsPage.stream().map(this::mapToDTO).toList();
            return createPagedResponse(materialNutrientsPage, content);
        }
    }

    private <T> PagedResponse<T> createPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        response.setEmpty(page.isEmpty());
        return response;
    }

    private Pageable createPageable(int materialId, int nutrientId, int page, int size, String sortDirection){
        Sort.Direction direction = Sort.Direction.fromString(
                sortDirection != null ? sortDirection : "ASC");
        Sort sort = Sort.by(direction, "amountPer100Unit");

        return PageRequest.of(page, size, sort);
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
        dto.setAmountPer100Unit(materialNutrient.getAmountPer100Unit());
        return dto;
    }
}
