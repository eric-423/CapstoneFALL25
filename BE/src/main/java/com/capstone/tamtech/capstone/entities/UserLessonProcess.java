package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "user_lesson_process")
public class UserLessonProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "is_learned")
    private Boolean isLearned;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "completed_at")
    private Date completedAt;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH})
    @JoinColumn(name = "user_training_id")
    private UserTraining userTraining;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH})
    @JoinColumn(name = "lesson_id")
    private Lessons lesson;
}
