package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.keys.KeyProductRecipes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRecipesRepository extends JpaRepository<ProductRecipes, KeyProductRecipes> {

    List<ProductRecipes> findByKeyProductRecipesProductId(int productId);

    List<ProductRecipes> findByKeyProductRecipesMaterialId(int materialId);
}
