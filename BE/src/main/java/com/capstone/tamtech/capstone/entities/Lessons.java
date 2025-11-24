package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "lessons")
public class Lessons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "point")
    private int point;

    @Column(name = "order_index")
    private int orderIndex;

    @Column(name = "is_active")
    private boolean isActive = true;

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<UserLessonProcess> userLessonProcessList;

    @ManyToOne( cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "training_id", nullable = false)
    private Trainings training;
}
