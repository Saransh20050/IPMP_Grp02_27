package org.example.app.controller;

import org.example.app.model.Author;
import org.example.app.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    @GetMapping("/authors/currently-borrowed")
    public List<Author> getAuthorsWithBorrowedBooks() {
        return libraryService.getAuthorsWithBorrowedBooks();
    }
}
