package org.example.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.example.FirebaseInitializer;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final Firestore db = FirebaseInitializer.getFirestore();

    // 📌 1. Add a New Author
    @PostMapping("/add")
    public String addAuthor(@RequestParam String author_id, @RequestParam String name) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("authors").document(author_id);
        Map<String, Object> data = new HashMap<>();
        data.put("author_id", author_id);
        data.put("name", name);

        ApiFuture<WriteResult> result = docRef.set(data);
        return "✅ Author added successfully at: " + result.get().getUpdateTime();
    }

    // 📌 2. Get an Author by ID
    @GetMapping("/get")
    public Map<String, Object> getAuthor(@RequestParam String author_id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("authors").document(author_id);
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            return document.getData();
        } else {
            return Map.of("error", "❌ Author not found!");
        }
    }
}
