package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsDTO implements Serializable {
    private long activeUsers;
    private long inactiveUsers;
    private long totalUsers;
    private Integer branchId;
}
