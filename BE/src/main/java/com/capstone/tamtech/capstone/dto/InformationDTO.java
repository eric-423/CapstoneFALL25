package com.capstone.tamtech.capstone.dto;


import lombok.Data;

import java.io.Serializable;

@Data
public class InformationDTO implements Serializable {
    private Integer informationId;
    private Integer userId;
    private String fullName;
    private String address;
    private String phone;
    private Boolean isDefault;
}
