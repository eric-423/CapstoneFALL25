package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CustomerBaseInfoDTO;
import com.capstone.tamtech.capstone.dto.CustomerDTO;
import com.capstone.tamtech.capstone.dto.InformationDTO;
import com.capstone.tamtech.capstone.entities.Information;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.InformationRequest;
import com.capstone.tamtech.capstone.repositories.InformationRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.InformationService;
import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InformationServiceImpl implements InformationService {

    @Autowired
    private InformationRepository informationRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtTokenHelper jwtTokenHelper;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private MemberAssociationServiceImpl memberAssociationService;

    private String extractBearerToken() {
        String header = httpServletRequest.getHeader("Authorization");
        if (header == null || header.isEmpty()) {
            throw new IllegalArgumentException("Thiếu header Authorization");
        }
        if (header.toLowerCase().startsWith("bearer ")) {
            return header.substring(7);
        }
        return header;
    }

    private int extractUserIdAndEnsureCustomer() {
        String token = extractBearerToken();
        Claims claims = jwtTokenHelper.getClaimsFromToken(token);
        Object idClaim = claims.get("i");
        if (idClaim == null) {
            throw new IllegalArgumentException("Token không chứa id người dùng");
        }
        Object roleClaim = claims.get("r");
        if (roleClaim == null || !"CUSTOMER".equalsIgnoreCase(String.valueOf(roleClaim))) {
            throw new IllegalArgumentException("Chỉ khách hàng mới được sử dụng tính năng này");
        }
        return Integer.parseInt(String.valueOf(idClaim));
    }

    private void ensureSameUser(int pathCustomerId) {
        int tokenUserId = extractUserIdAndEnsureCustomer();
        if (tokenUserId != pathCustomerId) {
            throw new IllegalArgumentException("Bạn không có quyền thao tác trên tài khoản của người khác");
        }
    }

    private void applyDefaultRule(int userId, boolean setDefault, Integer skipInformationId) {
        if (setDefault) {
            List<Information> infos = informationRepository.findByUserId(userId);
            for (Information info : infos) {
                if (skipInformationId != null && info.getId() == skipInformationId)
                    continue;
                if (info.isDefault()) {
                    info.setDefault(false);
                    informationRepository.save(info);
                }
            }
        }
    }

    @Override
    @Transactional
    public Information addInformation(int customerId, InformationRequest request) {
        ensureSameUser(customerId);
        Users user = usersRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        Information info = new Information();
        info.setUser(user);
        info.setName(request.getName());
        info.setAddress(request.getAddress());
        info.setPhoneNumber(request.getPhoneNumber());
        info.setDefault(Boolean.TRUE.equals(request.getIsDefault()));

        applyDefaultRule(customerId, info.isDefault(), null);
        return informationRepository.save(info);
    }

    @Override
    @Transactional
    public Information updateInformation(int customerId, int informationId, InformationRequest request) {
        ensureSameUser(customerId);
        Information info = informationRepository.findById(informationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin"));
        if (info.getUser() == null || info.getUser().getId() != customerId) {
            throw new IllegalArgumentException("Thông tin không thuộc về khách hàng này");
        }

        if (request.getName() != null)
            info.setName(request.getName());
        if (request.getAddress() != null)
            info.setAddress(request.getAddress());
        if (request.getPhoneNumber() != null)
            info.setPhoneNumber(request.getPhoneNumber());
        if (request.getIsDefault() != null)
            info.setDefault(request.getIsDefault());

        applyDefaultRule(customerId, info.isDefault(), info.getId());
        return informationRepository.save(info);
    }

    @Override
    @Transactional
    public void deleteInformation(int customerId, int informationId) {
        ensureSameUser(customerId);
        Information info = informationRepository.findById(informationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin"));
        if (info.getUser() == null || info.getUser().getId() != customerId) {
            throw new IllegalArgumentException("Thông tin không thuộc về khách hàng này");
        }
        informationRepository.delete(info);
    }

    @Override
    public InformationDTO getInformation(int customerId, int informationId) {
        ensureSameUser(customerId);
        Information info = informationRepository.findById(informationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin"));
        if (info.getUser() != null && info.getUser().getId() == customerId) {
            return toDTO(info);
        }
        return null;
    }

    @Override
    public List<InformationDTO> getAllInformations(int customerId) {
        List<Information> infos = informationRepository.findByUserId(customerId);
        return infos.stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public CustomerBaseInfoDTO getBaseInfo(int customerId) {
        Users user = usersRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        CustomerBaseInfoDTO baseInfo = new CustomerBaseInfoDTO();
        baseInfo.setId(customerId);
        baseInfo.setName(user.getFullName());
        baseInfo.setPhoneNumber(user.getPhoneNumber());
        baseInfo.setPoint(user.getMemberPoint());
        baseInfo.setMemberAssociation(memberAssociationService.getMemberAssociationsByCustomer(customerId));

        return baseInfo;
    }

    @Override
    public Integer getTotalPoints(int customerId) {
        Users user = usersRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        return user.getMemberPoint();
    }

    @Override
    public CustomerDTO getCustomerByPhone(String phone) {
        Users users = usersRepository.findByPhoneNumber(phone).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy khách hàng với số điện thoại: " + phone));

        if (!users.getRoleHistories().get(users.getRoleHistories().size() - 1).getRole().getName().equals("CUSTOMER")) {
            throw new IllegalArgumentException("Người dùng không phải là khách hàng");
        }
        CustomerDTO dto = new CustomerDTO();
        dto.setId(users.getId());
        dto.setFullName(users.getFullName());
        dto.setPhone(users.getPhoneNumber());
        dto.setMemberPoint(users.getMemberPoint());
        return dto;
    }

    private InformationDTO toDTO(Information information) {
        InformationDTO dto = new InformationDTO();
        dto.setInformationId(information.getId());
        dto.setFullName(information.getName());
        dto.setAddress(information.getAddress());
        dto.setPhone(information.getPhoneNumber());
        dto.setIsDefault(information.isDefault());
        return dto;
    }
}
