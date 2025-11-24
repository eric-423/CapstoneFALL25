package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Trainings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingRepository extends JpaRepository<Trainings, Integer> {

    Optional<Trainings> findByName(String name);

    List<Trainings> findByRoleId(int roleId);

    Page<Trainings> findByRoleId(int roleId, Pageable pageable);

    Page<Trainings> findByRoleIdAndIsActiveTrue(int roleId, Pageable pageable);

    List<Trainings> findByRole_IdAndIsActive(int id, Boolean isActive);


    Page<Trainings> findByIsActiveTrue(Pageable pageable);

    Page<Trainings> findAll(Pageable pageable);

    @Query("""
            SELECT t FROM Trainings t
            LEFT JOIN t.role r
            WHERE (:roleId IS NULL OR (r IS NOT NULL AND r.id = :roleId))
            AND (:isActive IS NULL OR t.isActive = :isActive)
            AND (
                :keyword IS NULL OR :keyword = '' OR
                LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(COALESCE(t.note, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Trainings> searchTrainings(
            @Param("roleId") Integer roleId,
            @Param("isActive") Boolean isActive,
            @Param("keyword") String keyword,
            Pageable pageable);
}
