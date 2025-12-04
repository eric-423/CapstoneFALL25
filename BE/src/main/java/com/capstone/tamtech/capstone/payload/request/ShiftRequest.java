package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftRequest {
    private String name;
    private String description;
    private Time startTime;
    private Time endTime;
    private Integer branchId;
    private Boolean isActive;
}


