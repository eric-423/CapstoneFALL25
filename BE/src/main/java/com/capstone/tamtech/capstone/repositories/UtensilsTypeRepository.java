package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UtensilsType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtensilsTypeRepository extends JpaRepository<UtensilsType, Integer> {

    Optional<UtensilsType> findByName(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);

    @Query("""
            SELECT ut FROM UtensilsType ut
            WHERE (:keyword IS NULL
                   OR LOWER(ut.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(COALESCE(ut.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<UtensilsType> search(@Param("keyword") String keyword, Pageable pageable);
}
