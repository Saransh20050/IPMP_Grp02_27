package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long professorId;

    private String name;
    private String department;
}
