package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleHistoryCreateRequest {
    private Integer userId;
    private Integer roleId;
    private Integer branchId;
    private Date startDate;
}
