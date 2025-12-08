package com.capstone.tamtech.capstone.dto;

import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.entities.ComboItem;
import com.capstone.tamtech.capstone.entities.OrderItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ComboDTO {

    private int id;

    private String name;

    private String description;

    private Double price;

    private Date startDate;

    private Date endDate;

    private boolean isActive;

    private int branchId;

    private String imageUrl;

    private List<ComboItemDTO> comboItems;
}
