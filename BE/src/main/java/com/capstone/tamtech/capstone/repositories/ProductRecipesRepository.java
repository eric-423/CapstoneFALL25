package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.ProductRecipes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRecipesRepository extends JpaRepository<ProductRecipes, Integer> {
    List<ProductRecipes> findByProductIdOrderByCreatedAtDesc(int productId);

    List<ProductRecipes> findByProductIdOrderByOrderStepAscCreatedAtAsc(int productId);

    List<ProductRecipes> findByProductId(int productId);

    List<ProductRecipes> findByMaterialId(int materialId);

    List<ProductRecipes> findByCookingMethodId(int cookingMethodId);

    boolean existsByProductId(int productId);

    boolean existsByProductIdAndOrderStep(int productId, Integer orderStep);

    List<ProductRecipes> findByProductIdAndOrderStep(int productId, Integer orderStep);

    @Modifying
    @Query("delete from ProductRecipes pr where pr.product.id = :productId")
    void deleteByProductId(@Param("productId") int productId);
}
