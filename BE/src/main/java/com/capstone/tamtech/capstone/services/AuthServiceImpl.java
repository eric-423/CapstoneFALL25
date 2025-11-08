package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UserDTO;
import com.capstone.tamtech.capstone.entities.Role;
import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.*;
import com.capstone.tamtech.capstone.repositories.MemberAssociationRepository;
import com.capstone.tamtech.capstone.repositories.RoleHistoryRepository;
import com.capstone.tamtech.capstone.repositories.RoleRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.AuthService;
import com.capstone.tamtech.capstone.services.impl.OtpService;
import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenHelper jwtTokenHelper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private MemberAssociationRepository memberAssociationRepository;

    private static final long TOKEN_EXPIRATION_TIME = 86400000L; // 24 hours


    @Transactional(readOnly = true)
    public LoginResponse customerLogin(CustomerLoginRequest request) {
        Users user = usersRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Số điện thoại không tồn tại trong hệ thống"));

        if (!Boolean.TRUE.equals(user.getPhoneVerified())) {
            throw new BadCredentialsException(
                    "Số điện thoại chưa được xác thực. Vui lòng xác thực số điện thoại trước khi đăng nhập.");
        }

        if (Boolean.TRUE.equals(user.getIsBan())) {
            throw new BadCredentialsException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Số điện thoại hoặc mật khẩu không chính xác");
        }

        RoleHistory activeRole = roleHistoryRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng chưa được phân quyền"));

        String roleName = activeRole.getRole().getName();

        if (!roleName.equalsIgnoreCase("CUSTOMER")) {
            throw new BadCredentialsException("Tài khoản này không phải là tài khoản khách hàng");
        }

        String token = jwtTokenHelper.generateToken(user, roleName, TOKEN_EXPIRATION_TIME);

        return buildLoginResponse(token, user, roleName);
    }

    @Override
    @Transactional
    public UserDTO customerRegister(CustomerRegisterRequest customerRegisterRequest) {
        Users customer = new Users();

        usersRepository.save(customer);
        RoleHistory roleHistory = new RoleHistory();

        roleHistory.setRole(roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER không tồn tại")));
        roleHistory.setUser(customer);

        roleHistoryRepository.save(roleHistory);

        customer.setFullName(customerRegisterRequest.getFullName());
        customer.setPhoneNumber(customerRegisterRequest.getPhoneNumber());
        customer.setPassword(passwordEncoder.encode(customerRegisterRequest.getPassword()));
        customer.setDateOfBirth(customerRegisterRequest.getDateOfBirth());
        customer.setNote("");
        customer.setEmailVerified(false);
        customer.setPhoneVerified(false);
        customer.setMemberAssociation(memberAssociationRepository.findById(1).orElse(null));

        usersRepository.save(customer);
        return convertToDTO(usersRepository.save(customer));
    }

    @Override
    public UserDTO employeeRegister(EmployeeRegisterRequest employeeRegisterRequest) {
        Users employee = new Users();

        usersRepository.save(employee);

        RoleHistory roleHistory = new RoleHistory();
        roleHistory.setRole(roleRepository.findById(employeeRegisterRequest.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER không tồn tại")));
        roleHistory.setUser(employee);

        roleHistoryRepository.save(roleHistory);


        employee.setFullName(employeeRegisterRequest.getFullName());
        employee.setAddress(employeeRegisterRequest.getAddress());
        employee.setPhoneNumber(employeeRegisterRequest.getPhoneNumber());
        employee.setEmail(employeeRegisterRequest.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeRegisterRequest.getPassword()));
        employee.setDateOfBirth(employeeRegisterRequest.getDateOfBirth());
        employee.setEmailVerified(false);
        employee.setPhoneVerified(false);

        usersRepository.save(employee);
        return convertToDTO(employee);
    }

    @Override
    public Boolean forgotPasswordForCustomer(CustomerForgotPasswordRequest customerForgotPasswordRequest) throws Exception {
        Users users = usersRepository.findByPhoneNumber(customerForgotPasswordRequest.getPhoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Số điện thoại không tồn tại trong hệ thống"));

        return otpService.sendOtp("zalo", users.getPhoneNumber());
    }

    @Override
    public Boolean resetPasswordForCustomer(CustomerResetPasswordRequest customerResetPasswordRequest) {
        boolean isValid = otpService.verifyOtp("zalo", customerResetPasswordRequest.getPhoneNumber(),
                customerResetPasswordRequest.getOtp());

        if (isValid) {
            Users users = usersRepository.findByPhoneNumber(customerResetPasswordRequest.getPhoneNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Số điện thoại không tồn tại trong hệ thống"));

            users.setPassword(passwordEncoder.encode(customerResetPasswordRequest.getNewPassword()));
            usersRepository.save(users);
            return true;
        }
        return false;
    }


    private UserDTO convertToDTO(Users user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhoneNumber());
        userDTO.setDateOfBirth(user.getDateOfBirth().toString());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setRole(roleHistoryRepository.findByUser_Id(user.getId()).getRole().getName());
        return userDTO;
    }


    @Transactional(readOnly = true)
    public LoginResponse employeeLogin(EmployeeLoginRequest request) {
        Users user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email không tồn tại trong hệ thống"));

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new BadCredentialsException("Email chưa được xác thực. Vui lòng xác thực email trước khi đăng nhập.");
        }

        if (Boolean.TRUE.equals(user.getIsBan())) {
            throw new BadCredentialsException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không chính xác");
        }

        RoleHistory activeRole = roleHistoryRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng chưa được phân quyền"));

        String roleName = activeRole.getRole().getName();

        if (roleName.equalsIgnoreCase("CUSTOMER")) {
            throw new BadCredentialsException(
                    "Tài khoản này không phải là tài khoản nhân viên. Vui lòng sử dụng tính năng đăng nhập dành cho khách hàng.");
        }

        String token = jwtTokenHelper.generateToken(user, roleName, TOKEN_EXPIRATION_TIME);

        return buildLoginResponse(token, user, roleName);
    }


    private LoginResponse buildLoginResponse(String token, Users user, String roleName) {
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(roleName)
                .memberPoint(user.getMemberPoint())
                .build();

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(TOKEN_EXPIRATION_TIME)
                .userInfo(userInfo)
                .build();
    }
}
