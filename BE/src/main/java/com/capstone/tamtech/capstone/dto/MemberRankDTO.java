package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MemberRankDTO implements Serializable {
    private int id;
    private String name;
    private int point;
    private String description;
}
