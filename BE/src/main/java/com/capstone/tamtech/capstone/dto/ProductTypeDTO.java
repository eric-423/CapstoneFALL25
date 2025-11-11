package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ProductTypeDTO implements Serializable {
    private Integer id;
    private String name;
    private String imageUrl;
}
