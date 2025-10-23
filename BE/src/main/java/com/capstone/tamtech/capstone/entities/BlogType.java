package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "blog_type")
@Data
@NoArgsConstructor
public class BlogType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_type_id")
    private int id;

    @Column(name = "blog_type_name")
    private String name;

    @OneToMany(mappedBy = "blogType", fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<Blog> blogs;


}
