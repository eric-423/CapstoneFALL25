package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignUsersToTrainingRequest {
    private List<Integer> userIds;
    private Integer branchId;
    private Integer roleId;
}
