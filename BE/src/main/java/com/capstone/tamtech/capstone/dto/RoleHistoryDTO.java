package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleHistoryDTO implements Serializable {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer roleId;
    private String roleName;
    private Integer branchId;
    private String branchName;
    private Date startDate;
    private Date endDate;
    private Boolean isActive;
}
