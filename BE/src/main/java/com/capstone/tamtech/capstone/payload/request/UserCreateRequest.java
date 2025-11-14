package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    private String fullName;
    private String address;
    private String phoneNumber;
    private String email;
    private String password;
    private Date dateOfBirth;
    private String note;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private Integer memberAssociationId;
}
