package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class LessonDTO {
    private Integer id;

    private String title;

    private String content;

    private String description;

    private String videoUrl;

    private Integer point;

    private Integer orderIndex;

    private Integer trainingId;

    private Boolean isActive;
}
