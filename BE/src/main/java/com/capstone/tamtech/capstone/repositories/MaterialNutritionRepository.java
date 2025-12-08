package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.MaterialNutrients;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialNutrient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialNutritionRepository extends JpaRepository<MaterialNutrients, KeyMaterialNutrient> {
    Page<MaterialNutrients> findByMaterial_IdAndNutrient_Id(int id, int id1, Pageable pageable);

    Page<MaterialNutrients> findByMaterial_Id(int id, Pageable pageable);

    Page<MaterialNutrients> findByNutrient_Id(int id, Pageable pageable);

    List<MaterialNutrients> findByMaterial_Id(int id);

}
