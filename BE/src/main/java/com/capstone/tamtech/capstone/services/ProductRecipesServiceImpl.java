package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ProductRecipesDTO;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.Product;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.keys.KeyProductRecipes;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequest;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.services.impl.ProductRecipesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductRecipesServiceImpl implements ProductRecipesService {

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public List<ProductRecipesDTO> getAllRecipes() {
        List<ProductRecipes> recipes = productRecipesRepository.findAll();
        return recipes.stream().map(this::toDTO).toList();
    }

    @Override
    public List<ProductRecipesDTO> getRecipesByProductId(int productId) {
        List<ProductRecipes> recipes = productRecipesRepository.findByKeyProductRecipes_ProductIdOrderByCreatedAtDesc(productId);
        return recipes.stream().map(this::toDTO).toList();
    }

    @Override
    public List<ProductRecipesDTO> getRecipesByMaterialId(int materialId) {
        List<ProductRecipes> recipes = productRecipesRepository.findByKeyProductRecipesMaterialId(materialId);
        return recipes.stream().map(this::toDTO).toList();
    }

    @Override
    public ProductRecipesDTO getRecipeById(int productId, int materialId) {
        KeyProductRecipes key = new KeyProductRecipes();
        key.setProductId(productId);
        key.setMaterialId(materialId);

        ProductRecipes recipe = productRecipesRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipe not found for productId: " + productId + " and materialId: " + materialId));

        return toDTO(recipe);
    }

    @Override
    @Transactional
    public ProductRecipesDTO createRecipe(ProductRecipesRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + request.getProductId()));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Material not found with id: " + request.getMaterialId()));

        KeyProductRecipes key = new KeyProductRecipes();
        key.setProductId(request.getProductId());
        key.setMaterialId(request.getMaterialId());

        if (productRecipesRepository.findById(key).isPresent()) {
            throw new IllegalArgumentException(
                    "Recipe already exists for productId: " + request.getProductId() +
                            " and materialId: " + request.getMaterialId());
        }

        ProductRecipes recipe = new ProductRecipes();
        recipe.setKeyProductRecipes(key);
        recipe.setQuantity(request.getQuantity());
        recipe.setProduct(product);
        recipe.setMaterial(material);

        ProductRecipes saved = productRecipesRepository.save(recipe);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public ProductRecipesDTO updateRecipe(int productId, int materialId, double quantity) {
        KeyProductRecipes key = new KeyProductRecipes();
        key.setProductId(productId);
        key.setMaterialId(materialId);

        ProductRecipes recipe = productRecipesRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipe not found for productId: " + productId + " and materialId: " + materialId));

        recipe.setQuantity(quantity);
        ProductRecipes updated = productRecipesRepository.save(recipe);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteRecipe(int productId, int materialId) {
        KeyProductRecipes key = new KeyProductRecipes();
        key.setProductId(productId);
        key.setMaterialId(materialId);

        ProductRecipes recipe = productRecipesRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipe not found for productId: " + productId + " and materialId: " + materialId));

        productRecipesRepository.delete(recipe);
    }

    private ProductRecipesDTO toDTO(ProductRecipes recipe) {
        ProductRecipesDTO dto = new ProductRecipesDTO();
        dto.setProductId(recipe.getKeyProductRecipes().getProductId());
        dto.setMaterialId(recipe.getKeyProductRecipes().getMaterialId());
        dto.setQuantity(recipe.getQuantity());

        if (recipe.getProduct() != null) {
            dto.setProductName(recipe.getProduct().getName());
        }

        if (recipe.getMaterial() != null) {
            dto.setMaterialName(recipe.getMaterial().getName());
        }

        return dto;
    }
}
