package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Combo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Integer> {

    List<Combo> findByIsActiveTrue();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM Combo c " +
            "LEFT JOIN c.comboItems ci " +
            "LEFT JOIN ci.product p " +
            "WHERE (:branchId IS NULL OR c.branch.id = :branchId) " +
            "AND (:keyword IS NULL OR :keyword = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:productName IS NULL OR :productName = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) " +
            "AND (:isActive IS NULL OR c.isActive = :isActive) " +
            "AND (:minPrice IS NULL OR c.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR c.price <= :maxPrice)")
    Page<Combo> searchCombos(
            @org.springframework.data.repository.query.Param("branchId") Integer branchId,
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("productName") String productName,
            @org.springframework.data.repository.query.Param("isActive") Boolean isActive,
            @org.springframework.data.repository.query.Param("minPrice") Double minPrice,
            @org.springframework.data.repository.query.Param("maxPrice") Double maxPrice,
            Pageable pageable
    );
}
