package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgressDTO {
    private Integer lessonId;
    private String title;
    private String description;
    private String content;
    private String videoUrl;
    private Integer point;
    private Integer orderIndex;
    private Boolean isLearned;
    private Date startDate;
    private Date completedAt;
}
