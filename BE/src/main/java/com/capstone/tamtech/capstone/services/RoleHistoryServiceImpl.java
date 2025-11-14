package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.RoleHistoryDTO;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.entities.Role;
import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryCreateRequest;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryUpdateRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.RoleHistoryRepository;
import com.capstone.tamtech.capstone.repositories.RoleRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.RoleHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class RoleHistoryServiceImpl implements RoleHistoryService {

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public List<RoleHistoryDTO> getAllRoleHistories() {
        List<RoleHistory> roleHistories = roleHistoryRepository.findAll();
        return roleHistories.stream().map(this::toDTO).toList();
    }

    @Override
    public List<RoleHistoryDTO> getRoleHistoriesByUserId(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<RoleHistory> roleHistories = user.getRoleHistories();
        return roleHistories.stream().map(this::toDTO).toList();
    }

    @Override
    public RoleHistoryDTO getRoleHistoryById(int roleHistoryId) {
        RoleHistory roleHistory = roleHistoryRepository.findById(roleHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Role history not found with id: " + roleHistoryId));
        return toDTO(roleHistory);
    }

    @Override
    public RoleHistoryDTO getActiveRoleHistoryByUserId(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        RoleHistory roleHistory = roleHistoryRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new ResourceNotFoundException("Active role history not found for user: " + userId));
        return toDTO(roleHistory);
    }

    @Override
    @Transactional
    public RoleHistoryDTO createRoleHistory(RoleHistoryCreateRequest request) {
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

        roleHistoryRepository.findByUserAndIsActiveTrue(user).ifPresent(oldRoleHistory -> {
            oldRoleHistory.setActive(false);
            oldRoleHistory.setEndDate(new Date());
            roleHistoryRepository.save(oldRoleHistory);
        });

        RoleHistory roleHistory = new RoleHistory();
        roleHistory.setUser(user);
        roleHistory.setRole(role);
        roleHistory.setStartDate(request.getStartDate() != null ? request.getStartDate() : new Date());
        roleHistory.setActive(true);

        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));
            roleHistory.setBranch(branch);
        }

        RoleHistory saved = roleHistoryRepository.save(roleHistory);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public RoleHistoryDTO updateRoleHistory(int roleHistoryId, RoleHistoryUpdateRequest request) {
        RoleHistory roleHistory = roleHistoryRepository.findById(roleHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Role history not found with id: " + roleHistoryId));

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));
            roleHistory.setRole(role);
        }

        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));
            roleHistory.setBranch(branch);
        } else if (request.getBranchId() == null && roleHistory.getBranch() != null) {
            roleHistory.setBranch(null);
        }

        if (request.getStartDate() != null) {
            roleHistory.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            roleHistory.setEndDate(request.getEndDate());
        }

        if (request.getIsActive() != null) {
            roleHistory.setActive(request.getIsActive());
            if (!request.getIsActive() && roleHistory.getEndDate() == null) {
                roleHistory.setEndDate(new Date());
            }
        }

        RoleHistory updated = roleHistoryRepository.save(roleHistory);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteRoleHistory(int roleHistoryId) {
        RoleHistory roleHistory = roleHistoryRepository.findById(roleHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Role history not found with id: " + roleHistoryId));

        roleHistoryRepository.delete(roleHistory);
    }

    @Override
    @Transactional
    public RoleHistoryDTO deactivateRoleHistory(int roleHistoryId) {
        RoleHistory roleHistory = roleHistoryRepository.findById(roleHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Role history not found with id: " + roleHistoryId));

        roleHistory.setActive(false);
        roleHistory.setEndDate(new Date());

        RoleHistory updated = roleHistoryRepository.save(roleHistory);
        return toDTO(updated);
    }

    private RoleHistoryDTO toDTO(RoleHistory roleHistory) {
        RoleHistoryDTO dto = new RoleHistoryDTO();
        dto.setId(roleHistory.getId());
        dto.setStartDate(roleHistory.getStartDate());
        dto.setEndDate(roleHistory.getEndDate());
        dto.setIsActive(roleHistory.isActive());

        if (roleHistory.getUser() != null) {
            dto.setUserId(roleHistory.getUser().getId());
            dto.setUserName(roleHistory.getUser().getFullName());
        }

        if (roleHistory.getRole() != null) {
            dto.setRoleId(roleHistory.getRole().getId());
            dto.setRoleName(roleHistory.getRole().getName());
        }

        if (roleHistory.getBranch() != null) {
            dto.setBranchId(roleHistory.getBranch().getId());
            dto.setBranchName(roleHistory.getBranch().getName());
        }

        return dto;
    }
}
