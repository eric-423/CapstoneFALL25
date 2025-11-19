package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingRequest {
    private String name;
    private String note;
    private Integer point;
    private Boolean isActive;
    private Integer roleId;
}
