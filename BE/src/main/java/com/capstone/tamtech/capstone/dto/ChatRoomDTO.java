package com.capstone.tamtech.capstone.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ChatRoomDTO {
    private int id;
    private int name;
    private List<ChatRoomDTO> chatRoomDTOS;
}
