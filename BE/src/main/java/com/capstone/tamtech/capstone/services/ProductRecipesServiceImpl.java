package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ProductRecipesDTO;
import com.capstone.tamtech.capstone.entities.CookingMethod;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.Product;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequest;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequestForMany;
import com.capstone.tamtech.capstone.repositories.CookingMethodRepository;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.services.impl.ProductRecipesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductRecipesServiceImpl implements ProductRecipesService {

        @Autowired
        private ProductRecipesRepository productRecipesRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private MaterialRepository materialRepository;

        @Autowired
        private CookingMethodRepository cookingMethodRepository;

        @Autowired
        private ProductServiceImpl productService;

        @Override
        public List<ProductRecipesDTO> getAllRecipes() {
                List<ProductRecipes> recipes = productRecipesRepository.findAll();
                return recipes.stream().map(this::toDTO).toList();
        }

        @Override
        public List<ProductRecipesDTO> getRecipesByProductId(int productId) {
                List<ProductRecipes> recipes = productRecipesRepository
                                .findByProductIdOrderByOrderStepAscCreatedAtAsc(productId);
                return recipes.stream().map(this::toDTO).toList();
        }

        @Override
        public List<ProductRecipesDTO> getRecipesByMaterialId(int materialId) {
                List<ProductRecipes> recipes = productRecipesRepository.findByMaterialId(materialId);
                return recipes.stream().map(this::toDTO).toList();
        }

        @Override
        public ProductRecipesDTO getRecipeById(int id) {
                ProductRecipes recipe = productRecipesRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recipe not found with id: " + id));

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

                CookingMethod cookingMethod = cookingMethodRepository.findById(request.getCookingMethodId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cooking Method not found with id: " + request.getCookingMethodId()));

                Integer orderStep = request.getOrderStep() != null && request.getOrderStep() > 0
                                ? request.getOrderStep()
                                : null;

                if (orderStep != null) {
                        boolean duplicateOrderStep = productRecipesRepository.existsByProductIdAndOrderStep(
                                        request.getProductId(), orderStep);
                        if (duplicateOrderStep) {
                                throw new IllegalArgumentException(
                                                "Product với id " + request.getProductId() +
                                                                " đã có công thức với orderStep " + orderStep
                                                                + ". Vui lòng chọn orderStep khác.");
                        }
                }

                ProductRecipes recipe = new ProductRecipes();
                recipe.setProduct(product);
                recipe.setMaterial(material);
                recipe.setCookingMethod(cookingMethod);
                recipe.setQuantity(request.getQuantity());
                recipe.setOrderStep(orderStep);

                ProductRecipes saved = productRecipesRepository.save(recipe);

                productService.reCalculateCaloriesForProduct(saved.getProduct().getId());

                return toDTO(saved);
        }

        @Override
        @Transactional
        public List<ProductRecipesDTO> createManyRecipes(int productId, List<ProductRecipesRequestForMany> requests) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + productId));

                List<Integer> orderSteps = new ArrayList<>();
                for (ProductRecipesRequestForMany request : requests) {
                        Integer orderStep = request.getOrderStep() != null && request.getOrderStep() > 0
                                        ? request.getOrderStep()
                                        : null;
                        if (orderStep != null) {
                                if (orderSteps.contains(orderStep)) {
                                        throw new IllegalArgumentException(
                                                        "Trong danh sách công thức mới có trùng orderStep " + orderStep
                                                                        +
                                                                        ". Vui lòng sửa lại orderStep cho các công thức.");
                                }
                                orderSteps.add(orderStep);

                                boolean duplicateOrderStep = productRecipesRepository.existsByProductIdAndOrderStep(
                                                productId, orderStep);
                                if (duplicateOrderStep) {
                                        throw new IllegalArgumentException(
                                                        "Product với id " + productId +
                                                                        " đã có công thức với orderStep " + orderStep
                                                                        + ". Vui lòng chọn orderStep khác.");
                                }
                        }
                }

                List<ProductRecipesDTO> result = new ArrayList<>();
                for (ProductRecipesRequestForMany request : requests) {
                        Material material = materialRepository.findById(request.getMaterialId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Material not found with id: " + request.getMaterialId()));

                        CookingMethod cookingMethod = cookingMethodRepository.findById(request.getCookingMethodId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Cooking Method not found with id: "
                                                                        + request.getCookingMethodId()));

                        ProductRecipes recipe = new ProductRecipes();
                        recipe.setProduct(product);
                        recipe.setMaterial(material);
                        recipe.setCookingMethod(cookingMethod);
                        recipe.setQuantity(request.getQuantity());
                        recipe.setOrderStep(
                                        request.getOrderStep() != null && request.getOrderStep() > 0
                                                        ? request.getOrderStep()
                                                        : null);

                        ProductRecipes saved = productRecipesRepository.save(recipe);
                        result.add(toDTO(saved));

                        productService.reCalculateCaloriesForProduct(saved.getProduct().getId());
                }
                return result;
        }

        @Override
        @Transactional
        public ProductRecipesDTO updateRecipe(int id, ProductRecipesRequest request) {
                ProductRecipes recipe = productRecipesRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recipe not found with id: " + id));

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + request.getProductId()));

                Material material = materialRepository.findById(request.getMaterialId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Material not found with id: " + request.getMaterialId()));

                CookingMethod cookingMethod = cookingMethodRepository.findById(request.getCookingMethodId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cooking Method not found with id: " + request.getCookingMethodId()));

                Integer orderStep = request.getOrderStep() != null && request.getOrderStep() > 0
                                ? request.getOrderStep()
                                : null;

                if (orderStep != null) {
                        List<ProductRecipes> existingRecipes = productRecipesRepository.findByProductIdAndOrderStep(
                                        request.getProductId(), orderStep);
                        boolean duplicateOrderStep = existingRecipes.stream()
                                        .anyMatch(r -> r.getId() != id);
                        if (duplicateOrderStep) {
                                throw new IllegalArgumentException(
                                                "Product với id " + request.getProductId() +
                                                                " đã có công thức khác với orderStep " + orderStep
                                                                + ". Vui lòng chọn orderStep khác.");
                        }
                }

                recipe.setProduct(product);
                recipe.setMaterial(material);
                recipe.setCookingMethod(cookingMethod);
                recipe.setQuantity(request.getQuantity());
                recipe.setOrderStep(orderStep);

                ProductRecipes updated = productRecipesRepository.save(recipe);

                productService.reCalculateCaloriesForProduct(updated.getProduct().getId());

                return toDTO(updated);
        }

        @Override
        @Transactional
        public void deleteRecipe(int id) {
                ProductRecipes recipe = productRecipesRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recipe not found with id: " + id));

                int productId = recipe.getProduct().getId();
                productRecipesRepository.delete(recipe);

                productService.reCalculateCaloriesForProduct(productId);
        }

        @Override
        @Transactional
        public List<ProductRecipesDTO> updateManyRecipeForOneProduct(int productId,
                        List<ProductRecipesRequestForMany> requests) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + productId));

                List<ProductRecipes> existingRecipes = productRecipesRepository.findByProductId(productId);
                if (!existingRecipes.isEmpty()) {
                        productRecipesRepository.deleteAll(existingRecipes);
                }

                if (requests == null || requests.isEmpty()) {
                        return List.of();
                }

                List<Integer> orderSteps = new ArrayList<>();
                for (ProductRecipesRequestForMany request : requests) {
                        Integer orderStep = request.getOrderStep() != null && request.getOrderStep() > 0
                                        ? request.getOrderStep()
                                        : null;
                        if (orderStep != null) {
                                if (orderSteps.contains(orderStep)) {
                                        throw new IllegalArgumentException(
                                                        "Trong danh sách công thức mới có trùng orderStep " + orderStep
                                                                        +
                                                                        ". Vui lòng sửa lại orderStep cho các công thức.");
                                }
                                orderSteps.add(orderStep);
                        }
                }

                List<ProductRecipes> recipesToSave = new ArrayList<>();
                for (ProductRecipesRequestForMany request : requests) {
                        Material material = materialRepository.findById(request.getMaterialId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Material not found with id: " + request.getMaterialId()));

                        CookingMethod cookingMethod = cookingMethodRepository.findById(request.getCookingMethodId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Cooking Method not found with id: "
                                                                        + request.getCookingMethodId()));

                        ProductRecipes recipe = new ProductRecipes();
                        recipe.setProduct(product);
                        recipe.setMaterial(material);
                        recipe.setCookingMethod(cookingMethod);
                        recipe.setQuantity(request.getQuantity());
                        recipe.setOrderStep(
                                        request.getOrderStep() != null && request.getOrderStep() > 0
                                                        ? request.getOrderStep()
                                                        : null);

                        recipesToSave.add(recipe);
                }

                List<ProductRecipesDTO> result = productRecipesRepository.saveAll(recipesToSave)
                                .stream()
                                .map(this::toDTO)
                                .toList();

                productService.reCalculateCaloriesForProduct(productId);

                return result;
        }

        private ProductRecipesDTO toDTO(ProductRecipes recipe) {
                ProductRecipesDTO dto = new ProductRecipesDTO();
                dto.setId(recipe.getId());
                dto.setQuantity(recipe.getQuantity());
                dto.setOrderStep(recipe.getOrderStep());
                dto.setCreatedAt(recipe.getCreatedAt());

                if (recipe.getProduct() != null) {
                        dto.setProductId(recipe.getProduct().getId());
                        dto.setProductName(recipe.getProduct().getName());
                }

                if (recipe.getMaterial() != null) {
                        dto.setMaterialId(recipe.getMaterial().getId());
                        dto.setMaterialName(recipe.getMaterial().getName());
                }

                if (recipe.getCookingMethod() != null) {
                        dto.setCookingMethodId(recipe.getCookingMethod().getId());
                        dto.setCookingMethodName(recipe.getCookingMethod().getName());
                }

                return dto;
        }
}
