package org.example.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int authorId;

    private String name;
    private String nationality;

    // Constructors
    public Author() {}
    public Author(int authorId, String name, String nationality) {
        this.authorId = authorId;
        this.name = name;
        this.nationality = nationality;
    }

    // Getters and Setters
}
