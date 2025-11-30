package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.OtpRequest;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.*;
import com.capstone.tamtech.capstone.services.impl.AuthService;
import com.capstone.tamtech.capstone.services.impl.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "API xác thực, đăng nhập, đăng ký và quản lý OTP")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @Operation(summary = "Đăng nhập khách hàng", description = "API cho phép khách hàng đăng nhập bằng số điện thoại và mật khẩu. Trả về token JWT để sử dụng cho các API yêu cầu xác thực.", security = {} // Không
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Số điện thoại hoặc mật khẩu không chính xác"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    @PostMapping("/customer/login")
    public ResponseEntity<LoginResponse> customerLogin(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin đăng nhập khách hàng", required = true, content = @Content(schema = @Schema(implementation = CustomerLoginRequest.class), examples = @ExampleObject(value = "{\"phoneNumber\": \"0987654321\", \"password\": \"password123\"}"))) @Valid @RequestBody CustomerLoginRequest request) {
        LoginResponse response = authService.customerLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/customer/forgot-password")
    public ResponseEntity<?> forgotPasswordForCustomer(@RequestBody CustomerForgotPasswordRequest customerForgotPasswordRequest) throws Exception {
        authService.forgotPasswordForCustomer(customerForgotPasswordRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/customer/reset-password")
    public ResponseEntity<?> resetPasswordForCustomer(@RequestBody CustomerResetPasswordRequest customerResetPasswordRequest) throws Exception {
        Boolean result = authService.resetPasswordForCustomer(customerResetPasswordRequest);
        ResponseData responseData = new ResponseData();
        if(!result){
            responseData.setStatus(400);
            responseData.setDesc("Đặt lại mật khẩu thất bại");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        } else{
            responseData.setStatus(200);
            responseData.setDesc("Đặt lại mật khẩu thành công");
        }
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @PostMapping("/customer/change-password/{customerId}")
    public ResponseEntity<?> changePasswordForCustomer(@PathVariable int customerId, @RequestBody String newPassword) throws Exception {
        Boolean result = authService.changePassword(customerId, newPassword);
        ResponseData responseData = new ResponseData();
        if(!result){
            responseData.setStatus(400);
            responseData.setDesc("Đổi mật khẩu thất bại");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        } else{
            responseData.setStatus(200);
            responseData.setDesc("Đổi mật khẩu thành công");
        }
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xác thực OTP thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseData.class), examples = @ExampleObject(value = "{\"status\": 200, \"desc\": \"Xác thực mã OTP thành công\", \"data\": true}"))),
            @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ hoặc đã hết hạn", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"status\": 400, \"desc\": \"Mã OTP không hợp lệ hoặc đã hết hạn\", \"data\": false}")))
    })
    @PostMapping("/otp/verify-otp-forgot-password")
    public ResponseEntity<?> verifyOtpForgotPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin xác thực OTP. Channel: zalo, Identifier: số điện thoại, InputOtp: mã OTP nhận được", required = true, content = @Content(schema = @Schema(implementation = OtpVerifyRequest.class), examples = @ExampleObject(value = "{\"channel\": \"email\", \"identifier\": \"user@example.com\", \"inputOtp\": \"123456\"}"))) @RequestBody OtpVerifyRequest otpVerifyRequest)
            throws Exception {
        ResponseData responseData = new ResponseData();
        Boolean result = otpService.verifyOtpForForgotPassword(otpVerifyRequest.getChannel(), otpVerifyRequest.getIdentifier(),
                otpVerifyRequest.getInputOtp(), false);
        responseData.setData(result);
        if (!result) {
            responseData.setDesc("Mã OTP không hợp lệ hoặc đã hết hạn");
            responseData.setStatus(400);
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        responseData.setDesc("Xác thực mã OTP thành công");
        responseData.setStatus(200);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Đăng ký tài khoản khách hàng", description = "API cho phép khách hàng tạo tài khoản mới với số điện thoại, mật khẩu và thông tin cá nhân", security = {}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Đăng ký thành công", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Số điện thoại đã tồn tại hoặc dữ liệu không hợp lệ")
    })
    @PostMapping("/customer/register")
    public ResponseEntity<?> customerRegister(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin đăng ký khách hàng", required = true, content = @Content(schema = @Schema(implementation = CustomerRegisterRequest.class), examples = @ExampleObject(value = "{\"fullName\": \"Nguyễn Văn A\", \"phoneNumber\": \"0987654321\", \"password\": \"password123\", \"dateOfBirth\": \"2000-01-01\"}"))) @RequestBody CustomerRegisterRequest customerRegisterRequest) {

        return new ResponseEntity<>(authService.customerRegister(customerRegisterRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Đăng nhập nhân viên", description = "API cho phép nhân viên đăng nhập bằng email và mật khẩu. Trả về token JWT và thông tin nhân viên.", security = {} // Không
            // yêu
            // cầu
            // JWT
            // cho
            // endpoint
            // này
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Email hoặc mật khẩu không chính xác"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    @PostMapping("/employee/login")
    public ResponseEntity<LoginResponse> employeeLogin(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin đăng nhập nhân viên", required = true, content = @Content(schema = @Schema(implementation = EmployeeLoginRequest.class), examples = @ExampleObject(value = "{\"email\": \"employee@tamtech.com\", \"password\": \"password123\"}"))) @Valid @RequestBody EmployeeLoginRequest request) {
        LoginResponse response = authService.employeeLogin(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Đăng ký tài khoản nhân viên", description = "API cho phép tạo tài khoản mới cho nhân viên với email, mật khẩu, thông tin cá nhân và vai trò (role)", security = {} // Không
            // yêu
            // cầu
            // JWT
            // cho
            // endpoint
            // này
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Đăng ký nhân viên thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseData.class))),
            @ApiResponse(responseCode = "400", description = "Email đã tồn tại hoặc dữ liệu không hợp lệ")
    })
    @PostMapping("/employee/register")
    public ResponseEntity<?> employeeRegister(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin đăng ký nhân viên", required = true, content = @Content(schema = @Schema(implementation = EmployeeRegisterRequest.class), examples = @ExampleObject(value = "{\"fullName\": \"Trần Thị B\", \"email\": \"employee@tamtech.com\", \"password\": \"password123\", \"phoneNumber\": \"0987654321\", \"address\": \"123 Đường ABC, Quận 1, TP.HCM\", \"dateOfBirth\": \"1995-01-01\", \"roleId\": 2}"))) @RequestBody EmployeeRegisterRequest employeeRegisterRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(authService.employeeRegister(employeeRegisterRequest));
        responseData.setDesc("Đăng ký nhân viên thành công");
        responseData.setStatus(201);
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @Operation(summary = "Gửi mã OTP", description = "API gửi mã OTP đến email hoặc số điện thoại của người dùng. Channel có thể là 'email' hoặc 'sms'.", security = {} // Không
            // yêu
            // cầu
            // JWT
            // cho
            // endpoint
            // này
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Gửi mã OTP thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseData.class))),
            @ApiResponse(responseCode = "400", description = "Channel hoặc identifier không hợp lệ"),
            @ApiResponse(responseCode = "500", description = "Lỗi khi gửi OTP")
    })
    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin gửi OTP. Channel: 'email' hoặc 'sms', Identifier: email hoặc số điện thoại", required = true, content = @Content(schema = @Schema(implementation = OtpRequest.class), examples = {
                    @ExampleObject(name = "Gửi OTP qua Email", value = "{\"channel\": \"email\", \"indentifier\": \"user@example.com\"}"),
                    @ExampleObject(name = "Gửi OTP qua SMS", value = "{\"channel\": \"sms\", \"indentifier\": \"0987654321\"}")
            })) @RequestBody OtpRequest otpRequest) throws Exception {
        ResponseData responseData = new ResponseData();
        responseData.setData(otpService.sendOtp(otpRequest.getChannel(), otpRequest.getIndentifier()));
        responseData.setDesc("Gửi mã OTP thành công");
        responseData.setStatus(200);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Xác thực mã OTP", description = "API xác thực mã OTP mà người dùng nhập vào. Kiểm tra tính hợp lệ và thời gian hết hạn của mã OTP.", security = {} // Không
            // yêu
            // cầu
            // JWT
            // cho
            // endpoint
            // này
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xác thực OTP thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseData.class), examples = @ExampleObject(value = "{\"status\": 200, \"desc\": \"Xác thực mã OTP thành công\", \"data\": true}"))),
            @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ hoặc đã hết hạn", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"status\": 400, \"desc\": \"Mã OTP không hợp lệ hoặc đã hết hạn\", \"data\": false}")))
    })
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin xác thực OTP. Channel: 'email' hoặc 'sms', Identifier: email hoặc số điện thoại, InputOtp: mã OTP nhận được", required = true, content = @Content(schema = @Schema(implementation = OtpVerifyRequest.class), examples = @ExampleObject(value = "{\"channel\": \"email\", \"identifier\": \"user@example.com\", \"inputOtp\": \"123456\"}"))) @RequestBody OtpVerifyRequest otpVerifyRequest)
            throws Exception {
        ResponseData responseData = new ResponseData();
        Boolean result = otpService.verifyOtp(otpVerifyRequest.getChannel(), otpVerifyRequest.getIdentifier(),
                otpVerifyRequest.getInputOtp());
        responseData.setData(result);
        if (!result) {
            responseData.setDesc("Mã OTP không hợp lệ hoặc đã hết hạn");
            responseData.setStatus(400);
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        responseData.setDesc("Xác thực mã OTP thành công");
        responseData.setStatus(200);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Lấy thời gian còn lại của mã OTP", description = "API trả về số giây còn lại trước khi mã OTP hết hạn. Hữu ích để hiển thị đếm ngược trên giao diện người dùng.", security = {}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy thời gian tồn tại của OTP thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResponseData.class), examples = @ExampleObject(value = "{\"status\": 200, \"desc\": \"Lấy thời gian tồn tại của OTP thành công\", \"data\": 120}"))),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy OTP hoặc đã hết hạn")
    })
    @GetMapping("/otp/ttl")
    public ResponseEntity<?> getOtpTtlSeconds(
            @Parameter(description = "Kênh gửi OTP (email hoặc sms)", required = true, example = "email") @RequestParam String channel,
            @Parameter(description = "Email hoặc số điện thoại đã nhận OTP", required = true, example = "user@example.com") @RequestParam String identifier) {
        ResponseData responseData = new ResponseData();
        long ttl = otpService.getOtpTtlSeconds(channel, identifier);
        responseData.setData(ttl);
        responseData.setDesc("Lấy thời gian tồn tại của OTP thành công");
        responseData.setStatus(200);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


}
