package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.GenerationType.IDENTITY;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "trainings")
public class Trainings {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "note")
    private String note;

    @Column(name = "point")
    private int point;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, cascade = {PERSIST, MERGE, REFRESH, DETACH})
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "training", fetch = FetchType.LAZY, cascade = {PERSIST, MERGE, REFRESH, DETACH})
    private java.util.List<UserTraining> userTrainingList;

    @OneToMany(mappedBy = "training", fetch = FetchType.LAZY, cascade = {PERSIST, MERGE, REFRESH, DETACH})
    private java.util.List<Lessons> lessonsList;

}
