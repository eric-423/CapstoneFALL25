package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Documents, Integer> {

    List<Documents> findByLesson_IdOrderByIdAsc(int lessonId);
}
