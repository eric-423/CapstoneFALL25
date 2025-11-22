package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDTO implements Serializable {
    private Integer id;
    private String fullName;
    private String address;
    private String phoneNumber;
    private String email;
    private Date dateOfBirth;
    private String note;
    private Boolean isBan;
    private Date createdAt;
    private String role;
    private Integer memberPoint;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private Boolean isBusy;
    private Integer memberAssociationId;
    private String memberAssociationName;
    private Integer branchId;
}
