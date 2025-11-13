package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.RoleDTO;
import com.capstone.tamtech.capstone.entities.Role;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.RoleRequest;
import com.capstone.tamtech.capstone.repositories.RoleRepository;
import com.capstone.tamtech.capstone.services.impl.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        if (!roles.isEmpty()) {
            return roles.stream().map(this::toDTO).toList();
        }

        return List.of();
    }

    @Override
    public RoleDTO createRole(RoleRequest roleRequest) {
        Role role = new Role();
        role.setName(roleRequest.getName());
        Role savedRole = roleRepository.save(role);
        return toDTO(savedRole);
    }

    @Override
    public RoleDTO updateRole(int roleId, RoleRequest roleRequest) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        if (role != null) {
            role.setName(roleRequest.getName());
            Role updatedRole = roleRepository.save(role);
            return toDTO(updatedRole);
        }
        return null;
    }

    @Override
    public RoleDTO getRoleById(int roleId) {
        Role role = roleRepository.findById(roleId).orElse(null);
        if (role != null) {
            return toDTO(role);
        }
        return null;
    }

    private RoleDTO toDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        return dto;
    }
}

