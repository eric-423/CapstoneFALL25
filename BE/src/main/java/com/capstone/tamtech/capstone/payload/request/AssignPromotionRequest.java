package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignPromotionRequest {
    private String promotionCode;
    private List<UserPromotionAssignment> userAssignments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserPromotionAssignment {
        private int userId;
        private int usageCount;
    }
}
