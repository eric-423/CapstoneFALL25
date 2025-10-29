package com.capstone.tamtech.capstone.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderDTO implements Serializable {

    private Integer id;

    private Double subTotal;

    private String promotionCode;

    private Double discountValue;

    private Integer discountPercent;

    private Double amount;

    private Double shippingFee;

    private Boolean isPickUp;

    private Boolean isTable;

    private Date delivery_at;

    private String orderStatus;
    private String note;
    private String payment_code;

    private String address;

    private String phone;

    private Integer pointUsed;

    private Integer pointEarned;

    private Date createdAt;

    private List<OrderIemDTO> orderItems;

    private CustomerDTO customerDTO;

    private Date pickupTime;

    private String customerName;

    private String status;


    @Override
    public String toString() {
        StringBuilder orderItems = new StringBuilder();

        for (OrderIemDTO orderItem : this.orderItems) {
            orderItems.append(orderItem.toString());
        }

        return "OrderDTO{" +
                "id=" + id +
                ", subTotal=" + subTotal +
                ", promotionCode='" + promotionCode + '\'' +
                ", discountValue=" + discountValue +
                ", discountPercent=" + discountPercent +
                ", amount=" + amount +
                ", shippingFee=" + shippingFee +
                ", isPickUp=" + isPickUp +
                ", delivery_at=" + delivery_at +
                ", orderStatus='" + orderStatus + '\'' +
                ", note='" + note + '\'' +
                ", payment_code='" + payment_code + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", pointUsed=" + pointUsed +
                ", pointEarned=" + pointEarned +
                ", createdAt=" + createdAt +
                ", orderItems=" + orderItems +
                ", customerDTO=" + customerDTO.toString() +
                '}';
    }
}
