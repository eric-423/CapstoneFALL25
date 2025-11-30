package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.MemberAssociation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberAssociationRepository extends JpaRepository<MemberAssociation, Integer> {

    Optional<MemberAssociation> findByName(String name);

    MemberAssociation findByMembers_Id(int id);

    @Query("SELECT ma FROM MemberAssociation ma WHERE ma.point <= :customerPoint ORDER BY ma.point DESC")
    List<MemberAssociation> findByPointLessThanEqualOrderByPointDesc(@Param("customerPoint") int customerPoint,
            Pageable pageable);

}
