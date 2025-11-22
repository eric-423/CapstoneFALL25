package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDTO implements Serializable {
    private int id;
    private String name;
    private String note;
    private int point;
    private Date createdAt;
    private Date updateAt;
    private Boolean isActive;
    private Integer roleId;
    private String roleName;
    private Integer lessonCount;
    private Integer totalLessonPoint;
}
