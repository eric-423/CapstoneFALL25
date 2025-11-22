package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UtensilsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtensilsTypeRepository extends JpaRepository<UtensilsType, Integer> {

    Optional<UtensilsType> findByName(String name);
}
