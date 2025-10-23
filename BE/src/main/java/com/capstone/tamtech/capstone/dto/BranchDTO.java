package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class BranchDTO implements Serializable {
    private int id;

    private String name;

    private String address;

    private String phone;

    private boolean isParent;

    private boolean isActive;
}
