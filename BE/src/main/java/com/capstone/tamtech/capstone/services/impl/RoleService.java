package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.RoleDTO;
import com.capstone.tamtech.capstone.payload.request.RoleRequest;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRoles();
    RoleDTO createRole(RoleRequest roleRequest);
    RoleDTO updateRole(int roleId, RoleRequest roleRequest);
    RoleDTO getRoleById(int roleId);
}
