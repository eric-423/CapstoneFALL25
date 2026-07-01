package com.capstone.tamtech.capstone.exception;

import com.capstone.tamtech.capstone.payload.request.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {

                List<String> errors = ex.getBindingResult()
                                .getAllErrors()
                                .stream()
                                .map(error -> {
                                        if (error instanceof FieldError) {
                                                return ((FieldError) error).getField() + ": "
                                                                + error.getDefaultMessage();
                                        }
                                        return error.getDefaultMessage();
                                })
                                .collect(Collectors.toList());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Validation Error")
                                .message("Dữ liệu đầu vào không hợp lệ")
                                .path(request.getRequestURI())
                                .details(errors)
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponse> handleBadCredentialsException(
                        BadCredentialsException ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .error("Authentication Failed")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
                        ResourceNotFoundException ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Resource Not Found")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
                        DataIntegrityViolationException ex,
                        HttpServletRequest request) {

                log.info("event=customer_register status=duplicate_phone");

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message("Số điện thoại đã tồn tại trong hệ thống")
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
                        IllegalArgumentException ex,
                        HttpServletRequest request) {

                if (ex.getMessage() != null && ex.getMessage().contains("Số điện thoại đã tồn tại")) {
                        log.info("event=customer_register status=duplicate_phone");
                }

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequestException(
                        org.apache.coyote.BadRequestException ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ErrorResponse> handleRuntimeException(
                        RuntimeException ex,
                        HttpServletRequest request) {

                log.error("Runtime error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Runtime Error")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneralException(
                        Exception ex,
                        HttpServletRequest request) {

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(new Date())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("Internal Server Error")
                                .message("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.")
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
