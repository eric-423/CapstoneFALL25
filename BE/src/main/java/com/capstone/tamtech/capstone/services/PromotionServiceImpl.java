package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.PromotionValidationResult;
import com.capstone.tamtech.capstone.entities.Promotion;
import com.capstone.tamtech.capstone.entities.UserPromotion;
import com.capstone.tamtech.capstone.entities.keys.UserPromotionKey;
import com.capstone.tamtech.capstone.repositories.PromotionRepository;
import com.capstone.tamtech.capstone.repositories.UserPromotionRepository;
import com.capstone.tamtech.capstone.services.impl.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private UserPromotionRepository userPromotionRepository;

    @Override
    @Transactional(readOnly = true)
    public PromotionValidationResult validateAndApplyPromotion(int userId, String promotionCode, double orderSubTotal) {
        if (promotionCode == null || promotionCode.isBlank()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không được để trống");
        }

        Optional<Promotion> promotionOptional = promotionRepository.findByNameIgnoreCase(promotionCode.trim());
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
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date now = new Date();

            if (promotion.getStartDate() != null && !promotion.getStartDate().isEmpty()) {
                Date startDate = sdf.parse(promotion.getStartDate());
                if (now.before(startDate)) {
                    return false;
                }
            }

            if (promotion.getEndDate() != null && !promotion.getEndDate().isEmpty()) {
                Date endDate = sdf.parse(promotion.getEndDate());
                if (now.after(endDate)) {
                    return false;
                }
            }

            return true;
        } catch (ParseException e) {
            return false;
        }
    }
}
