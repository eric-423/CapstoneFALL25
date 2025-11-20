package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTrainingUpdateRequest {
    private Integer point;
    private Boolean isPassed;
    private Date completedAt;
}
