package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CookingMethodNutrientDTO;
import com.capstone.tamtech.capstone.entities.CookingMethod;
import com.capstone.tamtech.capstone.entities.CookingMethodNutrients;
import com.capstone.tamtech.capstone.entities.Nutrients;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.keys.KeyCookingMethodNutrients;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.CookingMethodNutrientRequest;
import com.capstone.tamtech.capstone.repositories.CookingMethodNutrientRepository;
import com.capstone.tamtech.capstone.repositories.CookingMethodRepository;
import com.capstone.tamtech.capstone.repositories.NutrientRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.services.impl.CookingMethodNutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CookingMethodNutrientServiceImpl implements CookingMethodNutrientService {

    @Autowired
    private CookingMethodNutrientRepository cookingMethodNutrientRepository;

    @Autowired
    private CookingMethodRepository cookingMethodRepository;

    @Autowired
    private NutrientRepository nutrientRepository;

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private ProductServiceImpl productService;

    @Override
    public CookingMethodNutrientDTO createCookingMethodNutrient(CookingMethodNutrientRequest request) {
        CookingMethod cookingMethod = cookingMethodRepository.findById(request.getCookingMethodId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cooking Method not found with id: " + request.getCookingMethodId()));

        Nutrients nutrient = nutrientRepository.findById(request.getNutrientId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Nutrient not found with id: " + request.getNutrientId()));

        KeyCookingMethodNutrients key = new KeyCookingMethodNutrients();
        key.setCookingMethodId(request.getCookingMethodId());
        key.setNutrientId(request.getNutrientId());

        CookingMethodNutrients cookingMethodNutrient = new CookingMethodNutrients();
        cookingMethodNutrient.setKeyCookingMethodNutrients(key);
        cookingMethodNutrient.setCookingMethod(cookingMethod);
        cookingMethodNutrient.setNutrient(nutrient);
        cookingMethodNutrient.setRetentionFactor(request.getRetentionFactor());

        cookingMethodNutrientRepository.save(cookingMethodNutrient);

        recalculateCaloriesForAffectedProducts(cookingMethod.getId());

        return mapToDTO(cookingMethodNutrient);
    }

    @Override
    public CookingMethodNutrientDTO updateCookingMethodNutrient(int cookingMethodId, int nutrientId,
            CookingMethodNutrientRequest request) {
        KeyCookingMethodNutrients key = new KeyCookingMethodNutrients();
        key.setCookingMethodId(cookingMethodId);
        key.setNutrientId(nutrientId);

        CookingMethodNutrients cookingMethodNutrient = cookingMethodNutrientRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking Method Nutrient not found"));

        cookingMethodNutrient.setRetentionFactor(request.getRetentionFactor());

        cookingMethodNutrientRepository.save(cookingMethodNutrient);

        recalculateCaloriesForAffectedProducts(cookingMethodId);

        return mapToDTO(cookingMethodNutrient);
    }

    @Override
    public CookingMethodNutrientDTO getCookingMethodNutrientById(int cookingMethodId, int nutrientId) {
        KeyCookingMethodNutrients key = new KeyCookingMethodNutrients();
        key.setCookingMethodId(cookingMethodId);
        key.setNutrientId(nutrientId);

        CookingMethodNutrients cookingMethodNutrient = cookingMethodNutrientRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking Method Nutrient not found"));
        return mapToDTO(cookingMethodNutrient);
    }

    @Override
    public List<CookingMethodNutrientDTO> getAllCookingMethodNutrients() {
        List<CookingMethodNutrients> cookingMethodNutrients = cookingMethodNutrientRepository.findAll();
        return cookingMethodNutrients.stream().map(this::mapToDTO).toList();
    }

    @Override
    public void deleteCookingMethodNutrient(int cookingMethodId, int nutrientId) {
        KeyCookingMethodNutrients key = new KeyCookingMethodNutrients();
        key.setCookingMethodId(cookingMethodId);
        key.setNutrientId(nutrientId);

        CookingMethodNutrients cookingMethodNutrient = cookingMethodNutrientRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking Method Nutrient not found"));

        int affectedCookingMethodId = cookingMethodNutrient.getCookingMethod().getId();
        cookingMethodNutrientRepository.delete(cookingMethodNutrient);

        recalculateCaloriesForAffectedProducts(affectedCookingMethodId);
    }

    private void recalculateCaloriesForAffectedProducts(int cookingMethodId) {
        List<ProductRecipes> recipes = productRecipesRepository.findByCookingMethodId(cookingMethodId);
        recipes.stream()
                .map(recipe -> recipe.getProduct().getId())
                .distinct()
                .forEach(productService::reCalculateCaloriesForProduct);
    }

    private CookingMethodNutrientDTO mapToDTO(CookingMethodNutrients cookingMethodNutrient) {
        CookingMethodNutrientDTO dto = new CookingMethodNutrientDTO();
        dto.setCookingMethodId(cookingMethodNutrient.getCookingMethod().getId());
        dto.setCookingMethodName(cookingMethodNutrient.getCookingMethod().getName());
        dto.setNutrientId(cookingMethodNutrient.getNutrient().getId());
        dto.setNutrientName(cookingMethodNutrient.getNutrient().getName());
        dto.setRetentionFactor(cookingMethodNutrient.getRetentionFactor());
        return dto;
    }
}
