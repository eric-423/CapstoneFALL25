package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Time;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO implements Serializable {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer shiftId;
    private String shiftName;
    private Integer branchId;
    private String branchName;
    private String name;
    private String description;
    private Date date;
    private Time startTime;
    private Time endTime;
}
