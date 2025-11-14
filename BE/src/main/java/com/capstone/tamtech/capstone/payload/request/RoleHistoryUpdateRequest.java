package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleHistoryUpdateRequest {
    private Integer roleId;
    private Integer branchId;
    private Date startDate;
    private Date endDate;
    private Boolean isActive;
}
