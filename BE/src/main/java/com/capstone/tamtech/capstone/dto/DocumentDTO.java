package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DocumentDTO {
    private Integer id;
    private String name;
    private String refLink;
    private String description;
    private Integer lessonId;
}
