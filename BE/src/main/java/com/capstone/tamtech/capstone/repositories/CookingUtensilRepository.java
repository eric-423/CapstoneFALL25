package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.CookingUtensil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CookingUtensilRepository extends JpaRepository<CookingUtensil, Integer> {

    boolean existsByNameIgnoreCaseAndWarehouseId(String name, Integer warehouseId);

    boolean existsByNameIgnoreCaseAndWarehouseIdAndIdNot(String name, Integer warehouseId, Integer id);

    boolean existsByUtensilsTypeId(int utensilsTypeId);

    @Query("""
            SELECT cu FROM CookingUtensil cu
            WHERE (:keyword IS NULL OR LOWER(cu.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:utensilsTypeId IS NULL OR cu.utensilsType.id = :utensilsTypeId)
              AND (:warehouseId IS NULL OR cu.warehouse.id = :warehouseId)
            """)
    Page<CookingUtensil> search(@Param("keyword") String keyword,
                                @Param("utensilsTypeId") Integer utensilsTypeId,
                                @Param("warehouseId") Integer warehouseId,
                                Pageable pageable);
}
