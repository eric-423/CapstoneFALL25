package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UserLessonProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonProcessRepository extends JpaRepository<UserLessonProcess, Integer> {

    Optional<UserLessonProcess> findByUserTraining_IdAndLesson_Id(int userTrainingId, int lessonId);

    List<UserLessonProcess> findByUserTraining_Id(int userTrainingId);

    long countByUserTraining_IdAndIsLearnedTrue(int userTrainingId);


}
