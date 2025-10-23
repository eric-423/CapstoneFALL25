package com.capstone.tamtech.capstone.entities;


import com.capstone.tamtech.capstone.entities.keys.KeyChatRoomUser;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_room_user")
@NoArgsConstructor
@Data
public class ChatRoomUser {

    @EmbeddedId
    private KeyChatRoomUser keyChatRoomUser;

    @ManyToOne(cascade =  {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "chat_room_id", insertable = false, updatable = false)
    private ChatRoom chatRoom;

    @ManyToOne(cascade =  {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Users user;
}
