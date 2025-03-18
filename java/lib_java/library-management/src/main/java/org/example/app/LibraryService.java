package org.example.app.service;

import org.example.app.repository.*;
import org.example.app.model.Author;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {
    @Autowired
    private AuthorRepository authorRepository;

    public List<Author> getAuthorsWithBorrowedBooks() {
        return authorRepository.findAll();  // Replace with custom query logic
    }
}
