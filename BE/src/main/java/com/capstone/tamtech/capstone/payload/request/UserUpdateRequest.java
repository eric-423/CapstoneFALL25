package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    private String fullName;
    private String address;
    private String phoneNumber;
    private String email;
    private String password;
    private Date dateOfBirth;
    private String note;
    private Boolean isBan;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private Boolean isBusy;
    private Integer memberPoint;
    private Integer memberAssociationId;
}
