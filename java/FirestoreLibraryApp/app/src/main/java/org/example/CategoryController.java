package org.example.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.example.FirebaseInitializer;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final Firestore db = FirebaseInitializer.getFirestore();

    // 📌 1. Add a New Category
    @PostMapping("/add")
    public String addCategory(@RequestParam String category_id, @RequestParam String name) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("categories").document(category_id);
        Map<String, Object> data = new HashMap<>();
        data.put("category_id", category_id);
        data.put("name", name);

        ApiFuture<WriteResult> result = docRef.set(data);
        return "✅ Category added successfully at: " + result.get().getUpdateTime();
    }

    // 📌 2. Get a Category by ID
    @GetMapping("/get")
    public Map<String, Object> getCategory(@RequestParam String category_id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("categories").document(category_id);
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            return document.getData();
        } else {
            return Map.of("error", "❌ Category not found!");
        }
    }
}
