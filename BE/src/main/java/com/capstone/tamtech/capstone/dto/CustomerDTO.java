package com.capstone.tamtech.capstone.dto;


import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class CustomerDTO implements Serializable {

    private Integer id;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private Boolean isActive;

    private String dateOfBirth;

    private Date createdAt;

    private Integer memberPoint;

    private String memberRank;

    @Override
    public String toString() {
        return "CustomerDTO{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", isActive=" + isActive +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", createdAt=" + createdAt +
                ", memberPoint=" + memberPoint +
                ", memberRank='" + memberRank + '\'' +
                '}';
    }
}
