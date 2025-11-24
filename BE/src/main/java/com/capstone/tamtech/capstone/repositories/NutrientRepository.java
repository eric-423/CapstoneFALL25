package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Nutrients;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NutrientRepository extends JpaRepository<Nutrients, Integer> {
    Page<Nutrients> findByCodeContainsIgnoreCaseOrNameContainsIgnoreCaseOrUnitIgnoreCase(String code, String name, String unit, Pageable pageable);

}
