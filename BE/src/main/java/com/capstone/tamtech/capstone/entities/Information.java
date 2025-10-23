package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "information")
@Data
@NoArgsConstructor
public class Information {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "information_id")
    private int id;

    @Column(name = "information_name")
    private String name;

    @Column(name = "information_address")
    private String address;

    @Column(name = "information_phone")
    private String phoneNumber;

    @Column(name = "is_default")
    private boolean isDefault;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "user_id")
    private Users user;
}
