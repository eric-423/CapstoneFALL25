package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.CookingMethodNutrients;
import com.capstone.tamtech.capstone.entities.keys.KeyCookingMethodNutrients;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CookingMethodNutrientRepository extends JpaRepository<CookingMethodNutrients, KeyCookingMethodNutrients> {
}
