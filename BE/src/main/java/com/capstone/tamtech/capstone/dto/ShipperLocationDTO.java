package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipperLocationDTO {
    private int orderId;
    private int shipperId;
    private String shipperName;
    private Double latitude;
    private Double longitude;
    private Date timestamp;

    private String customerAddress;
    private Double estimatedDistance;
}
