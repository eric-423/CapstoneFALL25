package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.entities.MemberAssociation;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.UserCreateRequest;
import com.capstone.tamtech.capstone.payload.request.UserUpdateRequest;
import com.capstone.tamtech.capstone.repositories.MemberAssociationRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MemberAssociationRepository memberAssociationRepository;

    @Override
    public List<UserManagementDTO> getAllUsers() {
        List<Users> users = usersRepository.findAll();
        return users.stream().map(this::toDTO).toList();
    }

    @Override
    public UserManagementDTO getUserById(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return toDTO(user);
    }

    @Override
    @Transactional
    public UserManagementDTO createUser(UserCreateRequest request) {
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            usersRepository.findByEmail(request.getEmail()).ifPresent(u -> {
                throw new IllegalArgumentException("Email already exists: " + request.getEmail());
            });
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            usersRepository.findByPhoneNumber(request.getPhoneNumber()).ifPresent(u -> {
                throw new IllegalArgumentException("Phone number already exists: " + request.getPhoneNumber());
            });
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setAddress(request.getAddress());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDateOfBirth(request.getDateOfBirth());
        user.setNote(request.getNote());
        user.setIsBan(false);
        user.setCreatedAt(new Date());
        user.setMemberPoint(0);
        user.setEmailVerified(request.getEmailVerified() != null ? request.getEmailVerified() : false);
        user.setPhoneVerified(request.getPhoneVerified() != null ? request.getPhoneVerified() : false);
        user.setIsBusy(false);

        if (request.getMemberAssociationId() != null) {
            MemberAssociation memberAssociation = memberAssociationRepository.findById(request.getMemberAssociationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Member association not found with id: " + request.getMemberAssociationId()));
            user.setMemberAssociation(memberAssociation);
        }

        Users saved = usersRepository.save(user);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public UserManagementDTO updateUser(int userId, UserUpdateRequest request) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getEmail() != null && !request.getEmail().isEmpty()
                && !request.getEmail().equals(user.getEmail())) {
            usersRepository.findByEmail(request.getEmail()).ifPresent(u -> {
                if (u.getId() != userId) {
                    throw new IllegalArgumentException("Email already exists: " + request.getEmail());
                }
            });
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()
                && !request.getPhoneNumber().equals(user.getPhoneNumber())) {
            usersRepository.findByPhoneNumber(request.getPhoneNumber()).ifPresent(u -> {
                if (u.getId() != userId) {
                    throw new IllegalArgumentException("Phone number already exists: " + request.getPhoneNumber());
                }
            });
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getNote() != null) {
            user.setNote(request.getNote());
        }
        if (request.getIsBan() != null) {
            user.setIsBan(request.getIsBan());
        }
        if (request.getEmailVerified() != null) {
            user.setEmailVerified(request.getEmailVerified());
        }
        if (request.getPhoneVerified() != null) {
            user.setPhoneVerified(request.getPhoneVerified());
        }
        if (request.getIsBusy() != null) {
            user.setIsBusy(request.getIsBusy());
        }
        if (request.getMemberPoint() != null) {
            user.setMemberPoint(request.getMemberPoint());
        }

        if (request.getMemberAssociationId() != null) {
            MemberAssociation memberAssociation = memberAssociationRepository.findById(request.getMemberAssociationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Member association not found with id: " + request.getMemberAssociationId()));
            user.setMemberAssociation(memberAssociation);
        }

        Users updated = usersRepository.save(user);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteUser(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        usersRepository.delete(user);
    }

    @Override
    @Transactional
    public UserManagementDTO banUser(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsBan(true);
        Users updated = usersRepository.save(user);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public UserManagementDTO unbanUser(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsBan(false);
        Users updated = usersRepository.save(user);
        return toDTO(updated);
    }

    private UserManagementDTO toDTO(Users user) {
        UserManagementDTO dto = new UserManagementDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setNote(user.getNote());
        dto.setIsBan(user.getIsBan());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setMemberPoint(user.getMemberPoint());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setPhoneVerified(user.getPhoneVerified());
        dto.setIsBusy(user.getIsBusy());
        dto.setRole(user.getRoleHistories().get(user.getRoleHistories().size()-1).getRoleName());

        if (user.getMemberAssociation() != null) {
            dto.setMemberAssociationId(user.getMemberAssociation().getId());
            dto.setMemberAssociationName(user.getMemberAssociation().getName());
        }

        return dto;
    }
}
