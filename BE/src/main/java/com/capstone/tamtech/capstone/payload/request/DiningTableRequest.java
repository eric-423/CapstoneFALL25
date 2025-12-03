package com.capstone.tamtech.capstone.payload.request;

import com.capstone.tamtech.capstone.entities.Branch;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DiningTableRequest {
    private int id;

    private String name;

    private Boolean isActive = true;

    private Integer seat;

    private String note;

    private Integer branchId;
}
