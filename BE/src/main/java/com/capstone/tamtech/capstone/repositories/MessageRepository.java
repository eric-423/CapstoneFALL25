package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByChatRoomIdOrderBySendTimeAsc(int chatRoomId);
}
