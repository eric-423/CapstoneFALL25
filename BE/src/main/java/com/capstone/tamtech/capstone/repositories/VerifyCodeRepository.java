package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.VerifyCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerifyCodeRepository extends JpaRepository<VerifyCode, Integer> {

    Optional<VerifyCode> findByUserId(int userId);

    Optional<VerifyCode> findByCode(String code);
}
