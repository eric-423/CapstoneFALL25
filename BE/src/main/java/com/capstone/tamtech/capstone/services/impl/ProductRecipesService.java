package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductRecipesDTO;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequest;

import java.util.List;

public interface ProductRecipesService {
    List<ProductRecipesDTO> getAllRecipes();

    List<ProductRecipesDTO> getRecipesByProductId(int productId);

    List<ProductRecipesDTO> getRecipesByMaterialId(int materialId);

    ProductRecipesDTO getRecipeById(int productId, int materialId);

    ProductRecipesDTO createRecipe(ProductRecipesRequest request);

    ProductRecipesDTO updateRecipe(int productId, int materialId, double quantity);

    void deleteRecipe(int productId, int materialId);

    List<ProductRecipesDTO> updateManyRecipeForOneProduct(int productId, List<ProductRecipesRequest> requests);
}
