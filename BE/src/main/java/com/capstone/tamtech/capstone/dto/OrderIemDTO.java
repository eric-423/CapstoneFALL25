package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class OrderIemDTO implements Serializable {
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
