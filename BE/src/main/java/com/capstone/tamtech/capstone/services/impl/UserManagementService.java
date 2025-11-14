package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.payload.request.UserCreateRequest;
import com.capstone.tamtech.capstone.payload.request.UserUpdateRequest;

import java.util.List;

public interface UserManagementService {
    List<UserManagementDTO> getAllUsers();

    UserManagementDTO getUserById(int userId);

    UserManagementDTO createUser(UserCreateRequest request);

    UserManagementDTO updateUser(int userId, UserUpdateRequest request);

    void deleteUser(int userId);

    UserManagementDTO banUser(int userId);

    UserManagementDTO unbanUser(int userId);
}
