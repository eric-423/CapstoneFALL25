package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationTypeRepository extends JpaRepository<NotificationType, Integer> {

    Optional<NotificationType> findByName(String name);
}
