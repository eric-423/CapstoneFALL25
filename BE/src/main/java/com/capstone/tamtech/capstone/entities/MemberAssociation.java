package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "member_association")
@Data
public class MemberAssociation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_association_id")
    private int id;

    @Column(name = "member_association_point")
    private int point;

    @Column(name = "member_association_name")
    private String name;

    @Column(name = "member_association_description")
    private String description;

    @OneToMany(mappedBy = "memberAssociation", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE,CascadeType.REFRESH,CascadeType.DETACH})
    private List<Users> members;
}
