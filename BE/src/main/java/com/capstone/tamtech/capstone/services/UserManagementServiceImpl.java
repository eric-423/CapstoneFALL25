package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.dto.UserStatisticsDTO;
import com.capstone.tamtech.capstone.entities.MemberAssociation;
import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.UserCreateRequest;
import com.capstone.tamtech.capstone.payload.request.UserSearchRequest;
import com.capstone.tamtech.capstone.payload.request.UserUpdateRequest;
import com.capstone.tamtech.capstone.repositories.MemberAssociationRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @Autowired
    private com.capstone.tamtech.capstone.services.impl.MemberAssociationService memberAssociationService;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserManagementDTO> getAllUsers(UserSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<Users> userPage = usersRepository.searchUsers(
                searchRequest.getKeyword(),
                searchRequest.getRole(),
                searchRequest.getBranchId(),
                searchRequest.getStatus(),
                pageable);

        List<UserManagementDTO> content = userPage.getContent().stream()
                .map(this::toDTO)
                .toList();

        return createPagedResponse(userPage, content);
    }

    private Pageable createPageable(UserSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }

        String sortBy = mapSortField(searchRequest.getSortBy());
        Sort.Direction direction = Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "id";
        }

        return switch (sortBy.toLowerCase()) {
            case "id", "userid" -> "id";
            case "fullname", "name" -> "fullName";
            case "email" -> "email";
            case "phonenumber", "phone" -> "phoneNumber";
            case "createdat", "createddate" -> "createdAt";
            default -> "id";
        };
    }

    private <T> PagedResponse<T> createPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        response.setEmpty(page.isEmpty());
        return response;
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
        // Tự động cập nhật hạng thành viên dựa trên điểm (0 điểm -> hạng Đồng)
        if (request.getMemberAssociationId() == null) {
            memberAssociationService.updateMemberAssiociationForCustomer(saved.getId());
            // Reload để lấy hạng mới nhất
            saved = usersRepository.findById(saved.getId()).orElse(saved);
        }
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
        // Tự động cập nhật hạng thành viên dựa trên điểm nếu điểm đã thay đổi
        if (request.getMemberPoint() != null) {
            memberAssociationService.updateMemberAssiociationForCustomer(updated.getId());
            // Reload để lấy hạng mới nhất
            updated = usersRepository.findById(updated.getId()).orElse(updated);
        }
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

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsDTO getUserStatistics(Integer branchId) {
        long activeUsers = usersRepository.countActiveUsersByBranch(branchId);
        long inactiveUsers = usersRepository.countInactiveUsersByBranch(branchId);
        long totalUsers = activeUsers + inactiveUsers;

        UserStatisticsDTO statistics = new UserStatisticsDTO();
        statistics.setActiveUsers(activeUsers);
        statistics.setInactiveUsers(inactiveUsers);
        statistics.setTotalUsers(totalUsers);
        statistics.setBranchId(branchId);

        return statistics;
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

        if (user.getRoleHistories() != null && !user.getRoleHistories().isEmpty()) {
            user.getRoleHistories().stream()
                    .filter(rh -> rh.isActive())
                    .findFirst()
                    .ifPresentOrElse(
                            activeRole -> dto.setRole(activeRole.getRoleName()),
                            () -> {
                                var latestRole = user.getRoleHistories().get(user.getRoleHistories().size() - 1);
                                dto.setRole(latestRole.getRoleName());
                            });
        }

        if (user.getMemberAssociation() != null) {
            dto.setMemberAssociationId(user.getMemberAssociation().getId());
            dto.setMemberAssociationName(user.getMemberAssociation().getName());
        }

        if (user.getRoleHistories() != null && !user.getRoleHistories().isEmpty()) {
            RoleHistory latestRole = user.getRoleHistories().get(user.getRoleHistories().size() - 1);
            if (latestRole.getBranch() != null) {
                dto.setBranchId(latestRole.getBranch().getId());
            }
        }

        return dto;
    }
}
