package com.capstone.tamtech.capstone.dto;

import com.capstone.tamtech.capstone.entities.Users;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemberAssociationDTO {
    private int id;

    @Column(name = "member_association_point")
    private int point;

    @Column(name = "member_association_name")
    private String name;

    @Column(name = "member_association_description")
    private String description;
}
