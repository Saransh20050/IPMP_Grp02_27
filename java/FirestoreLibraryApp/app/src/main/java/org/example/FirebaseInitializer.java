package org.example;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;

import java.io.FileInputStream;
import java.io.IOException;

public class FirebaseInitializer {

    private static Firestore firestore;

    public static void initialize() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                FileInputStream serviceAccount = new FileInputStream("serviceAccountKey.json");

                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase Initialized Successfully!");

                firestore = FirestoreClient.getFirestore();
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("❌ Error initializing Firebase: " + e.getMessage());
            }
        }
    }

    public static Firestore getFirestore() {
        return firestore;
    }
}
