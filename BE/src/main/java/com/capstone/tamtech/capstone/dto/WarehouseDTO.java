package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseDTO {
    private int id;
    private String address;
    private Boolean isActive;
    private Integer branchId;
    private String branchName;
    private String branchAddress;
}
