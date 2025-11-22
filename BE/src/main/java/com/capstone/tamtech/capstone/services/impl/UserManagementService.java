package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.dto.UserStatisticsDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.UserCreateRequest;
import com.capstone.tamtech.capstone.payload.request.UserSearchRequest;
import com.capstone.tamtech.capstone.payload.request.UserUpdateRequest;

public interface UserManagementService {
    PagedResponse<UserManagementDTO> getAllUsers(UserSearchRequest searchRequest);

    UserManagementDTO getUserById(int userId);

    UserManagementDTO createUser(UserCreateRequest request);

    UserManagementDTO updateUser(int userId, UserUpdateRequest request);

    void deleteUser(int userId);

    UserManagementDTO banUser(int userId);

    UserManagementDTO unbanUser(int userId);

    UserStatisticsDTO getUserStatistics(Integer branchId);
}
