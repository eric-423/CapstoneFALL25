package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductRecipesDTO;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequest;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequestForMany;

import java.util.List;

public interface ProductRecipesService {
    List<ProductRecipesDTO> getAllRecipes();

    List<ProductRecipesDTO> getRecipesByProductId(int productId);

    List<ProductRecipesDTO> getRecipesByMaterialId(int materialId);

    ProductRecipesDTO getRecipeById(int id);

    ProductRecipesDTO createRecipe(ProductRecipesRequest request);

    List<ProductRecipesDTO> createManyRecipes(int productId, List<ProductRecipesRequestForMany> request);
    ProductRecipesDTO updateRecipe(int id, ProductRecipesRequest request);

    void deleteRecipe(int id);

    List<ProductRecipesDTO> updateManyRecipeForOneProduct(int productId, List<ProductRecipesRequestForMany> requests);
}
