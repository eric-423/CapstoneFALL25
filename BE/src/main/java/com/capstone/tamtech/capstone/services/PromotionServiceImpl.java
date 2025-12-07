package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.PromotionDTO;
import com.capstone.tamtech.capstone.dto.PromotionValidationResult;
import com.capstone.tamtech.capstone.entities.Promotion;
import com.capstone.tamtech.capstone.entities.PromotionType;
import com.capstone.tamtech.capstone.entities.UserPromotion;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.entities.keys.UserPromotionKey;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.AssignPromotionRequest;
import com.capstone.tamtech.capstone.payload.request.CreatePromotionRequest;
import com.capstone.tamtech.capstone.repositories.PromotionRepository;
import com.capstone.tamtech.capstone.repositories.PromotionTypeRepository;
import com.capstone.tamtech.capstone.repositories.UserPromotionRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private UserPromotionRepository userPromotionRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PromotionTypeRepository promotionTypeRepository;

    @Override
    @Transactional(readOnly = true)
    public PromotionValidationResult validateAndApplyPromotion(int userId, String promotionCode, double orderSubTotal) {
        if (promotionCode == null || promotionCode.isBlank()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không được để trống");
        }

        Optional<Promotion> promotionOptional = promotionRepository.findById(UUID.fromString(promotionCode.trim()));
        if (promotionOptional.isEmpty()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không tồn tại");
        }

        Promotion promotion = promotionOptional.get();

        if (!promotion.isStatus()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi đã hết hiệu lực");
        }

        if (!isPromotionDateValid(promotion)) {
            return PromotionValidationResult.invalid("Mã khuyến mãi đã hết hạn hoặc chưa đến thời gian sử dụng");
        }

        UserPromotionKey key = new UserPromotionKey(userId, promotion.getId());
        Optional<UserPromotion> userPromotionOptional = userPromotionRepository.findById(key);

        if (userPromotionOptional.isEmpty()) {
            return PromotionValidationResult.invalid("Bạn không có quyền sử dụng mã khuyến mãi này");
        }

        UserPromotion userPromotion = userPromotionOptional.get();

        if (userPromotion.getStatus() == UserPromotion.UserPromotionStatus.EXPIRED) {
            return PromotionValidationResult.invalid("Mã khuyến mãi của bạn đã hết hạn");
        }

        if (userPromotion.getStatus() == UserPromotion.UserPromotionStatus.USED) {
            if (userPromotion.getUsageCount() <= 0) {
                return PromotionValidationResult.invalid("Mã khuyến mãi đã được sử dụng hết");
            }
        }

        if (userPromotion.getStatus() != UserPromotion.UserPromotionStatus.AVAILABLE
                && userPromotion.getUsageCount() <= 0) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không khả dụng");
        }

        if (orderSubTotal < promotion.getMinimumOrderValue()) {
            return PromotionValidationResult.invalid(
                    String.format("Đơn hàng phải có giá trị tối thiểu %.0f VNĐ để sử dụng mã này",
                            promotion.getMinimumOrderValue()));
        }

        String promotionTypeName = promotion.getPromotionType() != null
                ? promotion.getPromotionType().getName()
                : null;

        int discountPercent = 0;
        double discountValue = 0.0;
        boolean isFreeShipping = false;

        if (promotionTypeName != null) {
            if (promotionTypeName.equalsIgnoreCase("Giảm giá theo %")) {
                discountPercent = Math.max(0, promotion.getValue());
            } else if (promotionTypeName.equalsIgnoreCase("Giảm giá cố định")) {
                discountValue = Math.max(0, promotion.getValue());
            } else if (promotionTypeName.equalsIgnoreCase("Miễn phí vận chuyển")) {
                isFreeShipping = true;
            }
        }

        return PromotionValidationResult.success(promotion, discountPercent, discountValue, isFreeShipping);
    }

    @Override
    @Transactional
    public void markPromotionAsUsed(int userId, UUID promotionId) {
        UserPromotionKey key = new UserPromotionKey(userId, promotionId);
        Optional<UserPromotion> userPromotionOptional = userPromotionRepository.findById(key);

        if (userPromotionOptional.isPresent()) {
            UserPromotion userPromotion = userPromotionOptional.get();

            int remainingUsage = userPromotion.getUsageCount() - 1;
            userPromotion.setUsageCount(remainingUsage);

            if (remainingUsage <= 0) {
                userPromotion.setStatus(UserPromotion.UserPromotionStatus.USED);
            }

            userPromotion.setUsedDate(new Date());

            userPromotionRepository.save(userPromotion);
        }
    }

    @Override
    @Transactional
    public void rollbackPromotionUsage(int userId, UUID promotionId) {
        UserPromotionKey key = new UserPromotionKey(userId, promotionId);
        Optional<UserPromotion> userPromotionOptional = userPromotionRepository.findById(key);

        if (userPromotionOptional.isPresent()) {
            UserPromotion userPromotion = userPromotionOptional.get();

            int newUsageCount = userPromotion.getUsageCount() + 1;
            userPromotion.setUsageCount(newUsageCount);

            if (userPromotion.getStatus() == UserPromotion.UserPromotionStatus.USED) {
                userPromotion.setStatus(UserPromotion.UserPromotionStatus.AVAILABLE);
            }

            userPromotionRepository.save(userPromotion);
        }
    }

    private boolean isPromotionDateValid(Promotion promotion) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date now = new Date();

            if (promotion.getStartDate() != null) {
                Date startDate = promotion.getStartDate();
                if (now.before(startDate)) {
                    return false;
                }
            }

            if (promotion.getEndDate() != null) {
                Date endDate = promotion.getEndDate();
                if (now.after(endDate)) {
                    return false;
                }
            }

            return true;

    }

    @Override
    @Transactional
    public PromotionDTO createPromotion(CreatePromotionRequest request, String createdByEmail) {
        Optional<Promotion> existingPromotion = promotionRepository.findByNameIgnoreCase(request.getName());
        if (existingPromotion.isPresent()) {
            throw new RuntimeException("Promotion code already exists");
        }

        Users createdBy = usersRepository.findByEmail(createdByEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PromotionType promotionType = promotionTypeRepository.findById(request.getPromotionTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Promotion type not found"));

        Promotion promotion = new Promotion();
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setValue(request.getValue());
        promotion.setMinimumOrderValue(request.getMinimumOrderValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setStatus(request.isStatus());
        promotion.setCreatedAt(new Date());
        promotion.setPromotionType(promotionType);
        promotion.setCreatedBy(createdBy);

        Promotion saved = promotionRepository.save(promotion);
        return convertToDTO(saved, null);
    }

    @Override
    @Transactional
    public int assignPromotionToUsers(AssignPromotionRequest request) {
        Promotion promotion = promotionRepository.findById(UUID.fromString(request.getPromotionCode()))
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

        int assignedCount = 0;
        List<AssignPromotionRequest.UserPromotionAssignment> assignments = request.getUserAssignments();

        for (int i = 0; i < assignments.size(); i++) {
            AssignPromotionRequest.UserPromotionAssignment assignment = assignments.get(i);

            Optional<Users> userOptional = usersRepository.findById(assignment.getUserId());
            if (userOptional.isEmpty()) {
                continue;
            }

            Users user = userOptional.get();

            UserPromotionKey key = new UserPromotionKey(user.getId(), promotion.getId());
            Optional<UserPromotion> existingOptional = userPromotionRepository.findById(key);

            if (existingOptional.isPresent()) {
                UserPromotion existing = existingOptional.get();
                existing.setUsageCount(existing.getUsageCount() + assignment.getUsageCount());
                userPromotionRepository.save(existing);
            } else {
                UserPromotion userPromotion = new UserPromotion();
                userPromotion.setId(key);
                userPromotion.setUser(user);
                userPromotion.setPromotion(promotion);
                userPromotion.setReceivedDate(new Date());
                userPromotion.setStatus(UserPromotion.UserPromotionStatus.AVAILABLE);
                userPromotion.setUsageCount(assignment.getUsageCount());
                userPromotionRepository.save(userPromotion);
            }

            assignedCount++;
        }

        return assignedCount;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionDTO> getCustomerPromotions(String phoneNumber) {
        Users customer = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<UserPromotion> userPromotions = userPromotionRepository.findByIdUserId(customer.getId());
        List<PromotionDTO> result = new ArrayList<>();

        for (int i = 0; i < userPromotions.size(); i++) {
            UserPromotion up = userPromotions.get(i);
            PromotionDTO dto = convertToDTO(up.getPromotion(), up);
            result.add(dto);
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionDTO> getAvailablePromotions(String phoneNumber) {
        Users customer = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<UserPromotion> userPromotions = userPromotionRepository.findAvailablePromotionsByUserId(customer.getId());
        List<PromotionDTO> result = new ArrayList<>();

        for (int i = 0; i < userPromotions.size(); i++) {
            UserPromotion up = userPromotions.get(i);
            if (up.getPromotion().isStatus() && isPromotionDateValid(up.getPromotion())) {
                PromotionDTO dto = convertToDTO(up.getPromotion(), up);
                result.add(dto);
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionDTO> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        List<PromotionDTO> result = new ArrayList<>();

        for (int i = 0; i < promotions.size(); i++) {
            Promotion promotion = promotions.get(i);
            PromotionDTO dto = convertToDTO(promotion, null);
            result.add(dto);
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionDTO getPromotionByCode(String promotionCode) {
        Promotion promotion = promotionRepository.findById(UUID.fromString(promotionCode))
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
        return convertToDTO(promotion, null);
    }

    @Override
    @Transactional
    public void updatePromotionStatus(String promotionCode, boolean status) {
        Promotion promotion = promotionRepository.findById(UUID.fromString(promotionCode))
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
        promotion.setStatus(status);
        promotionRepository.save(promotion);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validatePromotionForCustomer(String phoneNumber, String promotionCode, double orderValue) {
        Users customer = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        PromotionValidationResult result = validateAndApplyPromotion(
                customer.getId(),
                promotionCode,
                orderValue);

        return result.isValid();
    }

    @Override
    public List<PromotionDTO> getAvailablePromotionsByOrderAmount(String phoneNumber, double orderAmount) {
        Users users = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<Promotion> promotions = promotionRepository
                .findByUserPromotions_User_IdAndUserPromotions_UsageCountGreaterThanAndMinimumOrderValueGreaterThanEqual(
                        users.getId(), 0, orderAmount);

        List<PromotionDTO> result = new ArrayList<>();
        for (Promotion promotion : promotions) {
            if (!promotion.isStatus() || !isPromotionDateValid(promotion)) {
                continue;
            }

            UserPromotionKey key = new UserPromotionKey(users.getId(), promotion.getId());
            Optional<UserPromotion> userPromotionOptional = userPromotionRepository.findById(key);
            if (userPromotionOptional.isEmpty() || userPromotionOptional.get().getUsageCount() <= 0) {
                continue;
            }

            result.add(convertToDTO(promotion, userPromotionOptional.get()));
        }

        return result;
    }

    private PromotionDTO convertToDTO(Promotion promotion, UserPromotion userPromotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setDescription(promotion.getDescription());
        dto.setValue(promotion.getValue());
        dto.setMinimumOrderValue(promotion.getMinimumOrderValue());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setStatus(promotion.isStatus());
        dto.setCreatedAt(promotion.getCreatedAt());

        if (promotion.getPromotionType() != null) {
            dto.setPromotionTypeName(promotion.getPromotionType().getName());
        }

        if (promotion.getCreatedBy() != null) {
            dto.setCreatedByName(promotion.getCreatedBy().getFullName());
        }

        if (userPromotion != null) {
            dto.setReceivedDate(userPromotion.getReceivedDate());
            dto.setUsedDate(userPromotion.getUsedDate());
            dto.setUserPromotionStatus(userPromotion.getStatus().toString());
            dto.setUsageCount(userPromotion.getUsageCount());
        }

        return dto;
    }
}
