package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.ChatRoomUser;
import com.capstone.tamtech.capstone.entities.keys.KeyChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, KeyChatRoomUser> {

    List<ChatRoomUser> findByKeyChatRoomUserChatRoomId(int chatRoomId);

    List<ChatRoomUser> findByKeyChatRoomUserUserId(int userId);
}
