package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findByName(String name);

    /**
     * Tìm kiếm sản phẩm theo chi nhánh với các điều kiện lọc
     */
    @Query("SELECT DISTINCT p FROM Product p " +
            "INNER JOIN p.branchProducts bp " +
            "WHERE bp.keyBranchProduct.branchId = :branchId " +
            "AND (:keyword IS NULL OR :keyword = '' OR " +
            "     LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "     LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:productType IS NULL OR :productType = '' OR p.productType.name = :productType) " +
            "AND (:isActive IS NULL OR p.isActive = :isActive) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> searchProductsByBranch(
            @Param("branchId") Integer branchId,
            @Param("keyword") String keyword,
            @Param("productType") String productType,
            @Param("isActive") Boolean isActive,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);
}
