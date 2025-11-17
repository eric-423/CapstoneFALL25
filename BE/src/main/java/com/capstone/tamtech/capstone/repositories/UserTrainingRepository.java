package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UserTraining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTrainingRepository extends JpaRepository<UserTraining, Integer> {

    List<UserTraining> findByTraining_Id(int trainingId);

    List<UserTraining> findByUser_Id(int userId);
}
