package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UserTraining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTrainingRepository extends JpaRepository<UserTraining, Integer> {

    List<UserTraining> findByTraining_Id(int trainingId);

    List<UserTraining> findByUser_Id(int userId);

    Optional<UserTraining> findByTraining_IdAndUser_Id(int trainingId, int userId);
}
