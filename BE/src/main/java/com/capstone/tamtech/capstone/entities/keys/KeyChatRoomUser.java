package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyChatRoomUser implements Serializable {

    @Column(name = "chat_room_id")
    private int chatRoomId;

    @Column(name = "user_id")
    private int userId;

}
