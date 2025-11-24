package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ProductRecipesDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequest;
import com.capstone.tamtech.capstone.payload.request.ProductRecipesRequestForMany;
import com.capstone.tamtech.capstone.services.impl.ProductRecipesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
@Tag(name = "Product Recipes Management", description = "API quản lý công thức sản phẩm")
public class ProductRecipesController {

    @Autowired
    private ProductRecipesService productRecipesService;

    @Operation(summary = "Lấy tất cả công thức", description = "Trả về danh sách tất cả công thức sản phẩm")
    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
        try {
            List<ProductRecipesDTO> recipes = productRecipesService.getAllRecipes();
            ResponseData responseData = new ResponseData();
            responseData.setData(recipes);
            responseData.setDesc("Retrieved " + recipes.size() + " recipe(s)");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create-many/{productId}")
    public ResponseEntity<?> createManyRecipeForOneProduct(@PathVariable int productId, @RequestBody List<ProductRecipesRequestForMany> requests) {
        ResponseData responseData = new ResponseData();

        try {
            List<ProductRecipesDTO> result = productRecipesService.createManyRecipes(productId, requests);

            responseData.setDesc("Created " + requests.size() + " recipe(s) successfully");
            responseData.setData(result);
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-many/{productId}")
    public ResponseEntity<?> updateManyRecipeForOneProduct(
            @PathVariable int productId,
            @RequestBody List<ProductRecipesRequestForMany> requests) {
        ResponseData responseData = new ResponseData();
        try {

            List<ProductRecipesDTO> result = productRecipesService.updateManyRecipeForOneProduct(productId,
                    requests);
            responseData.setDesc("Replaced recipe list with " + result.size() + " item(s)");
            responseData.setData(result);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy công thức theo Product ID", description = "Trả về danh sách công thức của một sản phẩm")
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getRecipesByProductId(
            @Parameter(description = "ID sản phẩm", required = true) @PathVariable int productId) {
        try {
            List<ProductRecipesDTO> recipes = productRecipesService.getRecipesByProductId(productId);
            ResponseData responseData = new ResponseData();
            responseData.setData(recipes);
            responseData.setDesc("Retrieved " + recipes.size() + " recipe(s) for product " + productId);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy công thức theo Material ID", description = "Trả về danh sách công thức sử dụng một nguyên liệu")
    @GetMapping("/material/{materialId}")
    public ResponseEntity<?> getRecipesByMaterialId(
            @Parameter(description = "ID nguyên liệu", required = true) @PathVariable int materialId) {
        try {
            List<ProductRecipesDTO> recipes = productRecipesService.getRecipesByMaterialId(materialId);
            ResponseData responseData = new ResponseData();
            responseData.setData(recipes);
            responseData.setDesc("Retrieved " + recipes.size() + " recipe(s) for material " + materialId);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy công thức theo ID", description = "Trả về công thức cụ thể theo id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(
            @Parameter(description = "ID công thức", required = true) @PathVariable int id) {
        try {
            ProductRecipesDTO recipe = productRecipesService.getRecipeById(id);
            ResponseData responseData = new ResponseData();
            responseData.setData(recipe);
            responseData.setDesc("Recipe retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo công thức mới", description = "Tạo công thức mới cho sản phẩm")
    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody ProductRecipesRequest request) {
        try {
            ProductRecipesDTO recipe = productRecipesService.createRecipe(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(recipe);
            responseData.setDesc("Recipe created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật công thức", description = "Cập nhật công thức sản phẩm")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @Parameter(description = "ID công thức", required = true) @PathVariable int id,
            @RequestBody ProductRecipesRequest request) {
        try {
            ProductRecipesDTO recipe = productRecipesService.updateRecipe(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(recipe);
            responseData.setDesc("Recipe updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa công thức", description = "Xóa công thức khỏi sản phẩm")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(
            @Parameter(description = "ID công thức", required = true) @PathVariable int id) {
        try {
            productRecipesService.deleteRecipe(id);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Recipe deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
