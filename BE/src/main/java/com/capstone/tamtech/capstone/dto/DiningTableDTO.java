package com.capstone.tamtech.capstone.dto;

import com.capstone.tamtech.capstone.entities.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DiningTableDTO {

    private int id;

    private String name;

    private Boolean isActive;

    private Integer seat;

    private String note;

    private int branchId;

    private OrderDTO currentOrder;

    private List<OrderDTO> orders = new ArrayList<>();
}
