package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonOrderUpdateRequest {
    private Integer orderIndex;
    private List<OrderItem> orders;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private Integer lessonId;
        private Integer orderIndex;
    }
}
