package com.capstone.tamtech.capstone.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class MessageDTO {
    private int id;
    private String content;
    private int senderId;
    private Date sendTime;
}
