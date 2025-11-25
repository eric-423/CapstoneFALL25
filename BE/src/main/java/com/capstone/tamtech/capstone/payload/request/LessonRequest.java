package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LessonRequest {

    private String title;

    private String content;

    private String description;

    private String videoUrl;

    private Integer point;

    private Integer orderIndex;

    private Integer trainingId;

    private Boolean isActive;
}
