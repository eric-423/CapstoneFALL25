package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.MemberAssociation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberAssociationRepository extends JpaRepository<MemberAssociation, Integer> {

    Optional<MemberAssociation> findByName(String name);
}
