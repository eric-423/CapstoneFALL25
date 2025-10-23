package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.CookingUtensil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CookingUtensilRepository extends JpaRepository<CookingUtensil, Integer> {

}
