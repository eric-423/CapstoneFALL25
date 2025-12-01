package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CustomerBaseInfoDTO {
    private int id;
    private String name;
    private String phoneNumber;
    private int point;
    private MemberAssociationDTO memberAssociation;
}
