package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MaterialAllBranchDTO {
    private int id;
    private String name;
    private double quantity;
    private Integer unitId;
    private Integer materialTypeId;
    private String materialTypeName;
    private Boolean isDeleted;
}
