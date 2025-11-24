package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.ProductRecipes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRecipesRepository extends JpaRepository<ProductRecipes, Integer> {
    List<ProductRecipes> findByProductIdOrderByCreatedAtDesc(int productId);

    List<ProductRecipes> findByProductIdOrderByOrderStepAscCreatedAtAsc(int productId);

    List<ProductRecipes> findByProductId(int productId);

    List<ProductRecipes> findByMaterialId(int materialId);

    List<ProductRecipes> findByCookingMethodId(int cookingMethodId);

    // Check if a product has recipes
    boolean existsByProductId(int productId);

    // Check if orderStep already exists for a product (excluding current recipe if updating)
    boolean existsByProductIdAndOrderStep(int productId, Integer orderStep);

    // Find recipe by product and orderStep (excluding current recipe if updating)
    List<ProductRecipes> findByProductIdAndOrderStep(int productId, Integer orderStep);
}
