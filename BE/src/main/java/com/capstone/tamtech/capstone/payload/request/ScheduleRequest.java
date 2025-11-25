package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {
    private Integer userId;
    private String name;
    private String description;
    private Date date;
    private Time startTime;
    private Time endTime;
}
