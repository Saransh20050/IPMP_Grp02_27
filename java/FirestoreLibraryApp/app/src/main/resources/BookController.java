package org.example.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.example.FirebaseInitializer;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/books")
public class BookController {

    private final Firestore db = FirebaseInitializer.getFirestore();

    // 📌 1. Add a New Book
    @PostMapping("/add")
    public String addBook(@RequestParam String book_id,
                          @RequestParam String title,
                          @RequestParam String author_id,
                          @RequestParam String category_id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("books").document(book_id);
        Map<String, Object> data = new HashMap<>();
        data.put("book_id", book_id);
        data.put("title", title);
        data.put("author_id", author_id);
        data.put("category_id", category_id);

        ApiFuture<WriteResult> result = docRef.set(data);
        return "✅ Book added successfully at: " + result.get().getUpdateTime();
    }

    // 📌 2. Get a Book by ID
    @GetMapping("/get")
    public Map<String, Object> getBook(@RequestParam String book_id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("books").document(book_id);
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            return document.getData();
        } else {
            return Map.of("error", "❌ Book not found!");
        }
    }

    // 📌 3. Update a Book
    @PutMapping("/update")
    public String updateBook(@RequestParam String book_id,
                             @RequestParam(required = false) String title,
                             @RequestParam(required = false) String author_id,
                             @RequestParam(required = false) String category_id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("books").document(book_id);
        Map<String, Object> updates = new HashMap<>();

        if (title != null) updates.put("title", title);
        if (author_id != null) updates.put("author_id", author_id);
        if (category_id != null) updates.put("category_id", category_id);

        ApiFuture<WriteResult> result = docRef.update(updates);
        return "✅ Book updated at: " + result.get().getUpdateTime();
    }

    // 📌 4. Delete a Book
    @DeleteMapping("/delete")
    public String deleteBook(@RequestParam String book_id) throws ExecutionException, InterruptedException {
        db.collection("books").document(book_id).delete().get();
        return "✅ Book deleted successfully!";
    }
}
