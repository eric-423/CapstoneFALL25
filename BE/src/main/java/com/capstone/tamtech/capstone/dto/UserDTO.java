package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class UserDTO implements Serializable {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String dateOfBirth;
    private Date createdAt;
    private Integer branchId;
    private String role;
}
