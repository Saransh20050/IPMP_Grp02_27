package org.example;


import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LibraryApplication {

    public static void main(String[] args) {
        FirebaseInitializer.initialize(); // 🔥 Initialize Firebase
        SpringApplication.run(LibraryApplication.class, args);
    }
    
    @Bean
    public Firestore firestore() {
        return FirestoreOptions.getDefaultInstance().getService();
    }
}
