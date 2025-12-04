package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Time;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftDTO implements Serializable {
    private Integer id;
    private String name;
    private String description;
    private Time startTime;
    private Time endTime;
    private Integer branchId;
    private String branchName;
    private Boolean isActive;
}
