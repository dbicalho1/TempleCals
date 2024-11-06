package com.templecals.backend;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) throws IOException {
        // Initialize Firebase
        ClassPathResource serviceAccount = new ClassPathResource("serviceAccountKey.json");

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
            .build();

        // Ensure Firebase is only initialized once
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        SpringApplication.run(BackendApplication.class, args);

        // Optional: Confirm Firestore is accessible
        System.out.println("Firestore initialized: " + (FirestoreClient.getFirestore() != null));
    }
}

