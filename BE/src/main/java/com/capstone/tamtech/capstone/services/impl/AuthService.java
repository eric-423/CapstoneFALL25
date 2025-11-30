package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.UserDTO;
import com.capstone.tamtech.capstone.payload.request.*;

public interface AuthService {
    LoginResponse employeeLogin(EmployeeLoginRequest request);

    LoginResponse customerLogin(CustomerLoginRequest request);

    UserDTO customerRegister(CustomerRegisterRequest customerRegisterRequest);

    UserDTO employeeRegister(EmployeeRegisterRequest employeeRegisterRequest);

    Boolean forgotPasswordForCustomer(CustomerForgotPasswordRequest customerForgotPasswordRequest) throws Exception;

    Boolean resetPasswordForCustomer(CustomerResetPasswordRequest customerResetPasswordRequest);

    Boolean changePassword(int customerId, String newPassword);
}
