package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchDTO implements Serializable {
    private int id;

    private String name;

    private String address;

    private String phone;

    private boolean isParent;

    private boolean isActive;

}
