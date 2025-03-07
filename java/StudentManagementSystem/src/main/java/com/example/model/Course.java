package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;
}
