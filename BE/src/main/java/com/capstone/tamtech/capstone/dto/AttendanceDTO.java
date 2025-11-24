package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO implements Serializable {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer branchId;
    private String branchName;
    private Date workDate;
    private Timestamp checkIn;
    private Timestamp checkOut;
    private String status;
    private Integer workMinutes;
    private String note;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
