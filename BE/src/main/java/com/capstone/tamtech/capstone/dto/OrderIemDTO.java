package com.capstone.tamtech.capstone.dto;

import com.capstone.tamtech.capstone.entities.Combo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderIemDTO implements Serializable {
    private Long orderItemId;
    private int productId;
    private String productName;
    private int orderId;
    private int quantity;
    private double price;
    private String note;
    private String feedback;
    private boolean isFeedBackYet;
    private int feedbackPoint;
    private Date expiredFeedbackTime;
    private String productImg;
    private ComboDTO comboDTO;
    private Boolean isConfirmed;
    private Date confirmAt;
    private Boolean isDelivered;
    private Date deliveredAt;
    private Date cookedAt;
    private Boolean isCooked;


    @Override
    public String toString() {
        return "OrderIemDTO{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", orderId=" + orderId +
                ", quantity=" + quantity +
                ", price=" + price +
                ", note='" + note + '\'' +
                ", feedback='" + feedback + '\'' +
                ", isFeedBackYet=" + isFeedBackYet +
                ", feedbackPoint=" + feedbackPoint +
                ", expiredFeedbackTime=" + expiredFeedbackTime +
                ", productImg='" + productImg + '\'' +
                '}';
    }
}
