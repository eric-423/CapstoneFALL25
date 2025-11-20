package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Lessons;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lessons, Integer> {
    Page<Lessons> findByTraining_Id(int id, Pageable pageable);

    List<Lessons> findLessonsByTraining_Id(int id);

    List<Lessons> findByTraining_IdOrderByOrderIndexAsc(int trainingId);

    int countByTraining_Id(int trainingId);

    @Query("SELECT COALESCE(SUM(l.point), 0) FROM Lessons l WHERE l.training.id = :trainingId")
    Integer sumPointsByTrainingId(@Param("trainingId") int trainingId);
}
