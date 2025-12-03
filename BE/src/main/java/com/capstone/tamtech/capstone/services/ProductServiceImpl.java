package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ProductDTO;
import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.entities.keys.KeyCookingMethodNutrients;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialWarehouse;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductCreateRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.payload.request.RecipesRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private BranchProductRepository branchProductRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private CookingMethodNutrientRepository cookingMethodNutrientRepository;

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private CookingMethodRepository cookingMethodRepository;

    @Autowired
    private MaterialWarehouseRepository materialWarehouseRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductSearchDTO> searchProducts(ProductSearchRequest searchRequest) {
        if (searchRequest.getBranchId() == null) {
            throw new IllegalArgumentException("Branch ID là bắt buộc");
        }

        branchRepository.findById(searchRequest.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy chi nhánh với ID: " + searchRequest.getBranchId()));

        Pageable pageable = createPageable(searchRequest);

        Page<Product> productPage = productRepository.searchProductsByBranch(
                searchRequest.getBranchId(),
                searchRequest.getKeyword(),
                searchRequest.getProductTypeId(),
                searchRequest.getIsActive(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                pageable);

        Map<Integer, Integer> productQuantityMap = new HashMap<>();

        List<ProductSearchDTO> productDTOs = productPage.getContent().stream()
                .map(product -> mapToProductSearchDTO(product, productQuantityMap))
                .toList();

        List<ProductSearchDTO> result = productDTOs.stream().map(productSearchDTO -> {
            Product product = productRepository.findById(productSearchDTO.getProductId()).get();
            Branch branch = branchRepository.findById(searchRequest.getBranchId()).get();
            productSearchDTO.setInStock(isInStock(product, branch));
            return productSearchDTO;
        }).collect(Collectors.toList());

        return createPagedResponse(productPage, result);
    }

    public Boolean isInStock(Product product, Branch branch) {

        List<ProductRecipes> recipes = product.getProductRecipes();
        Map<Integer, Double> materialRequiredMap = new HashMap<>();

        for (ProductRecipes recipe : recipes) {
            int materialId = recipe.getMaterial().getId();
            double requiredQuantity = recipe.getQuantity();

            materialRequiredMap.put(materialId, requiredQuantity);
        }

        for (Map.Entry<Integer, Double> entry : materialRequiredMap.entrySet()) {
            int materialId = entry.getKey();
            double requiredQuantity = entry.getValue();

            KeyMaterialWarehouse keyMaterialWarehouse = new KeyMaterialWarehouse();
            keyMaterialWarehouse.setMaterialId(materialId);
            keyMaterialWarehouse.setWarehouseId(branch.getWarehouses().getId());

            Double availableQuantity = materialWarehouseRepository
                    .findById(keyMaterialWarehouse)
                    .map(materialWarehouse -> materialWarehouse.getQuantity())
                    .orElse(0.0);

            if (availableQuantity == null || availableQuantity < requiredQuantity) {
                return false;
            }
        }

        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductDTO> searchProductForAllBranch(ProductSearchRequest searchRequest) {

        Pageable pageable = createPageable(searchRequest);

        Page<Product> productPage = productRepository.getAllProduct(
                searchRequest.getKeyword(),
                searchRequest.getProductTypeId(),
                searchRequest.getIsActive(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                pageable);

        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(product -> toDTO(product))
                .collect(Collectors.toList());

        return createPagedResponse(productPage, productDTOs);
    }

    @Override
    public ProductDTO getProductById(Integer productId) {
        Product product = productRepository.findById(productId).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));

        return toDTO(product);
    }

    @Override
    public ProductDTO createProduct(ProductCreateRequest productCreateRequest) {
        Product product = new Product();

        List<ProductRecipes> productRecipesList = new ArrayList<>();

        product.setName(productCreateRequest.getName());
        product.setDescription(productCreateRequest.getDescription());
        product.setPrice(productCreateRequest.getPrice());
        product.setImage(productCreateRequest.getImageUrl());
        product.setCreatedDate(new Date());
        product.setUpdateDate(new Date());
        product.setActive(true);
        product.setProductType(productTypeRepository.findById(productCreateRequest.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại sản phẩm với ID: " + productCreateRequest.getTypeId())));

        for (RecipesRequest request : productCreateRequest.getRecipesRequests()) {
            Material material = materialRepository.findById(request.getMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Material not found with id: " + request.getMaterialId()));

            ProductRecipes productRecipes = new ProductRecipes();
            productRecipes.setProduct(product);
            productRecipes.setMaterial(material);
            productRecipes.setQuantity(request.getQuantity());
            productRecipes.setOrderStep(request.getOrderStep() > 0 ? request.getOrderStep() : null);

            if (request.getCookingMethodId() > 0) {
                productRecipes.setCookingMethod(cookingMethodRepository.findById(request.getCookingMethodId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Cooking method not found with id: " + request.getCookingMethodId())));
            } else {
                productRecipes.setCookingMethod(null);
            }

            productRecipesRepository.save(productRecipes);

            product.getProductRecipes().add(productRecipes);
            productRecipesList.add(productRecipes);
        }

        product.setProductRecipes(productRecipesList);
        productRepository.save(product);

        reCalculateCaloriesForProduct(product.getId());

        return toDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(int id, ProductCreateRequest productCreateRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        productRecipesRepository.deleteByProductId(product.getId());
        productRecipesRepository.flush();
        if (product.getProductRecipes() != null) {
            product.getProductRecipes().clear();
        }

        product.setName(productCreateRequest.getName());
        product.setDescription(productCreateRequest.getDescription());
        product.setPrice(productCreateRequest.getPrice());
        product.setImage(productCreateRequest.getImageUrl());
        product.setUpdateDate(new Date());
        product.setActive(true);
        product.setProductType(productTypeRepository.findById(productCreateRequest.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại sản phẩm với ID: " + productCreateRequest.getTypeId())));

        for (RecipesRequest request : productCreateRequest.getRecipesRequests()) {
            Material material = materialRepository.findById(request.getMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Material not found with id: " + request.getMaterialId()));

            ProductRecipes productRecipes = new ProductRecipes();
            productRecipes.setProduct(product);
            productRecipes.setMaterial(material);
            productRecipes.setQuantity(request.getQuantity());
            productRecipes.setOrderStep(request.getOrderStep() > 0 ? request.getOrderStep() : null);

            if (request.getCookingMethodId() > 0) {
                productRecipes.setCookingMethod(cookingMethodRepository.findById(request.getCookingMethodId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Cooking method not found with id: " + request.getCookingMethodId())));
            } else {
                productRecipes.setCookingMethod(null);
            }

            productRecipesRepository.save(productRecipes);

            if (product.getProductRecipes() != null) {
                product.getProductRecipes().add(productRecipes);
            }
        }

        productRepository.save(product);

        reCalculateCaloriesForProduct(product.getId());

        return toDTO(product);
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();

        if (product.getCaloriesCache() == null) {
            product.setCaloriesCache(reCalculateCaloriesForProduct(product.getId()));
            productRepository.save(product);
        }
        productDTO.setProductId(product.getId());
        productDTO.setProductName(product.getName());
        productDTO.setProductDescription(product.getDescription());
        productDTO.setProductImage(product.getImage());
        productDTO.setProductPrice(product.getPrice());
        productDTO.setProductType(product.getProductType().getName());
        productDTO.setStatus(product.isActive());
        productDTO.setCalories(product.getCaloriesCache());
        return productDTO;
    }

    private Pageable createPageable(ProductSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }

        String sortBy = mapSortField(searchRequest.getSortBy());

        Sort sort = Sort.by(Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC"),
                sortBy);

        return PageRequest.of(page, size, sort);
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "name", "productname" -> "name";
            case "price", "productprice" -> "price";
            case "createddate", "createdate" -> "createdDate";
            case "producttype", "type" -> "productType.name";
            default -> "name";
        };
    }

    private ProductSearchDTO mapToProductSearchDTO(Product product, Map<Integer, Integer> quantityMap) {
        if (product.getCaloriesCache() == null) {
            product.setCaloriesCache(reCalculateCaloriesForProduct(product.getId()));
            productRepository.save(product);
        }
        return ProductSearchDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .productDescription(product.getDescription())
                .productImage(product.getImage())
                .productPrice(product.getPrice())
                .productType(product.getProductType() != null ? product.getProductType().getName() : null)
                .productTypeId(product.getProductType() != null ? product.getProductType().getId() : 0)
                .isActive(product.isActive())
                .quantityInBranch(quantityMap.getOrDefault(product.getId(), 0))
                .createdDate(product.getCreatedDate())
                .updatedDate(product.getUpdateDate())
                .calories(product.getCaloriesCache())
                .build();
    }

    @Transactional
    public double reCalculateCaloriesForProduct(int productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + productId));

        List<ProductRecipes> recipes = productRecipesRepository.findByProductId(productId);
        double totalCalories = 0.0;

        for (ProductRecipes recipe : recipes) {
            Material material = recipe.getMaterial();
            double rawQuantity = recipe.getQuantity();

            if (material != null) {
                List<MaterialNutrients> materialNutrients = material.getMaterialNutrients();
                for (MaterialNutrients mn : materialNutrients) {
                    double baseNutrient = (rawQuantity * mn.getAmountPer100Unit()) / 100.0;
                    Nutrients nutrients = mn.getNutrient();
                    CookingMethod cookingMethod = recipe.getCookingMethod() != null ? recipe.getCookingMethod() : null;

                    if (cookingMethod != null) {
                        KeyCookingMethodNutrients keyCookingMethodNutrients = new KeyCookingMethodNutrients();
                        keyCookingMethodNutrients.setCookingMethodId(
                                recipe.getCookingMethod() != null ? recipe.getCookingMethod().getId() : 0);
                        keyCookingMethodNutrients.setNutrientId(nutrients.getId());

                        CookingMethodNutrients cookingMethodNutrients = cookingMethodNutrientRepository
                                .findById(keyCookingMethodNutrients)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Không tìm thấy thông tin dinh dưỡng phương pháp nấu với khóa: "
                                                + keyCookingMethodNutrients));

                        double cookedNutrient = baseNutrient * cookingMethodNutrients.getRetentionFactor();
                        double nutritionCalories = cookedNutrient * nutrients.getEnergyPerUnit();
                        totalCalories += nutritionCalories;
                    } else {
                        double nutritionCalories = baseNutrient * nutrients.getEnergyPerUnit();
                        totalCalories += nutritionCalories;
                    }
                }
            }
        }

        product.setCaloriesCache(totalCalories);
        productRepository.save(product);

        return totalCalories;
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
}
