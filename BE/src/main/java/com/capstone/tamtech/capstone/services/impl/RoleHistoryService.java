package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.RoleHistoryDTO;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryCreateRequest;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryUpdateRequest;

import java.util.List;

public interface RoleHistoryService {
    List<RoleHistoryDTO> getAllRoleHistories();

    List<RoleHistoryDTO> getRoleHistoriesByUserId(int userId);

    RoleHistoryDTO getRoleHistoryById(int roleHistoryId);

    RoleHistoryDTO getActiveRoleHistoryByUserId(int userId);

    RoleHistoryDTO createRoleHistory(RoleHistoryCreateRequest request);

    RoleHistoryDTO updateRoleHistory(int roleHistoryId, RoleHistoryUpdateRequest request);

    void deleteRoleHistory(int roleHistoryId);

    RoleHistoryDTO deactivateRoleHistory(int roleHistoryId);
}
