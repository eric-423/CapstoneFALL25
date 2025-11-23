package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.CookingMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CookingMethodRepository extends JpaRepository<CookingMethod, Integer> {
}
