package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UserDTO;
import com.capstone.tamtech.capstone.entities.Role;
import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.CustomerRegisterRequest;
import com.capstone.tamtech.capstone.repositories.MemberAssociationRepository;
import com.capstone.tamtech.capstone.repositories.RoleHistoryRepository;
import com.capstone.tamtech.capstone.repositories.RoleRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.OtpService;
import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private RoleHistoryRepository roleHistoryRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenHelper jwtTokenHelper;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private MemberAssociationRepository memberAssociationRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    private CustomerRegisterRequest validRequest;
    private Role customerRole;
    private Date fixedCreatedAt;

    @BeforeEach
    void setUp() {
        validRequest = new CustomerRegisterRequest();
        validRequest.setFullName("Nguyễn Văn A");
        validRequest.setPhoneNumber("0987654321");
        validRequest.setPassword("password123");

        customerRole = new Role();
        customerRole.setId(1);
        customerRole.setName("CUSTOMER");

        fixedCreatedAt = new Date(1_700_000_000_000L);
    }

    private void stubHappyPathMocks(Date dateOfBirth) {
        when(usersRepository.findByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(Optional.empty());
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(memberAssociationRepository.findById(1)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("$2a$hashed");

        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> {
            Users user = invocation.getArgument(0);
            user.setId(42);
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(fixedCreatedAt);
            }
            return user;
        });

        when(roleHistoryRepository.findByUserAndIsActiveTrue(any(Users.class))).thenAnswer(invocation -> {
            Users user = invocation.getArgument(0);
            RoleHistory rh = new RoleHistory();
            rh.setRole(customerRole);
            rh.setUser(user);
            rh.setRoleName("CUSTOMER");
            rh.setActive(true);
            return Optional.of(rh);
        });
    }

    @Test
    void test001Ut01_happyPathReturnsCompleteUserDto() {
        stubHappyPathMocks(null);

        UserDTO result = authService.customerRegister(validRequest);

        assertEquals(42, result.getId());
        assertEquals("Nguyễn Văn A", result.getFullName());
        assertEquals("0987654321", result.getPhone());
        assertEquals("CUSTOMER", result.getRole());
        assertNotNull(result.getCreatedAt());
    }

    @Test
    void test001Ut02_dateOfBirthMappedWhenProvided() throws Exception {
        Date dob = new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01");
        validRequest.setDateOfBirth(dob);
        stubHappyPathMocks(dob);

        UserDTO result = authService.customerRegister(validRequest);

        assertEquals("2000-01-01", result.getDateOfBirth());
    }

    @Test
    void test001Ut03_nullDateOfBirthDoesNotNpe() {
        validRequest.setDateOfBirth(null);
        stubHappyPathMocks(null);

        UserDTO result = assertDoesNotThrow(() -> authService.customerRegister(validRequest));

        assertNull(result.getDateOfBirth());
    }

    @Test
    void test001Ut04_passwordHashedBeforeSave() {
        stubHappyPathMocks(null);

        authService.customerRegister(validRequest);

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(captor.capture());
        assertEquals("$2a$hashed", captor.getValue().getPassword());
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void test001Ut05_defaultsOnNewUser() {
        stubHappyPathMocks(null);

        authService.customerRegister(validRequest);

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(captor.capture());
        Users saved = captor.getValue();
        assertEquals(false, saved.getPhoneVerified());
        assertEquals(false, saved.getIsBan());
    }

    @Test
    void test001Ut06_phoneVerifiedOnDto() {
        stubHappyPathMocks(null);

        UserDTO result = authService.customerRegister(validRequest);

        assertEquals(false, result.getPhoneVerified());
    }

    @Test
    void test001Ut07_noPasswordInDto() {
        stubHappyPathMocks(null);

        UserDTO result = authService.customerRegister(validRequest);

        assertNull(result.getEmail());
        assertNotEquals("password123", result.getPhone());
    }

    @Test
    void test001Ut08_duplicatePhoneProactiveCheck() {
        Users existing = new Users();
        existing.setPhoneNumber("0987654321");
        when(usersRepository.findByPhoneNumber("0987654321")).thenReturn(Optional.of(existing));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.customerRegister(validRequest));

        assertTrue(ex.getMessage().contains("Số điện thoại đã tồn tại"));
        assertTrue(ex.getMessage().contains("0987654321"));
        verify(usersRepository, never()).save(any());
    }

    @Test
    void test001Ut09_customerRoleMissing() {
        when(usersRepository.findByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(Optional.empty());
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.customerRegister(validRequest));
        verify(usersRepository, never()).save(any());
    }

    @Test
    void test001Ut10_singleSaveInHappyPath() {
        stubHappyPathMocks(null);

        authService.customerRegister(validRequest);

        verify(usersRepository, times(1)).save(any(Users.class));
        verify(roleHistoryRepository, never()).save(any());
    }

    @Test
    void test001Ut11_activeRoleHistoryCreated() {
        stubHappyPathMocks(null);

        authService.customerRegister(validRequest);

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(captor.capture());
        Users saved = captor.getValue();
        assertNotNull(saved.getRoleHistories());
        assertEquals(1, saved.getRoleHistories().size());
        RoleHistory rh = saved.getRoleHistories().get(0);
        assertEquals("CUSTOMER", rh.getRoleName());
        assertTrue(rh.isActive());
        assertEquals(saved, rh.getUser());
        assertEquals(customerRole, rh.getRole());
        assertNotNull(rh.getStartDate());
    }

    @Test
    void test001Ut12_convertToDtoNullSafeDob() {
        validRequest.setDateOfBirth(null);
        stubHappyPathMocks(null);

        UserDTO result = authService.customerRegister(validRequest);

        assertNull(result.getDateOfBirth());
    }
}