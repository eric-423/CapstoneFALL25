package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Nutrients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NutrientRepository extends JpaRepository<Nutrients, Integer> {
}
