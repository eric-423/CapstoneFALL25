package com.capstone.tamtech.capstone.payload.request;

import com.capstone.tamtech.capstone.entities.Lessons;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DocumentRequest {
    private String name;
    private String refLink;
    private String description;
    private Integer lessonId;
}
