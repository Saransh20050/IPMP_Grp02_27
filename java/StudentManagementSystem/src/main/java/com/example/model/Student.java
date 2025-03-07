package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String name;
    private int age;
    private String gender;
    private String email;
    private String phoneNumber;
}
