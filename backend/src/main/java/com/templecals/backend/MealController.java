package com.templecals.backend.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MealController {

    @PostMapping("/logMeal")
    public ResponseEntity<String> logMeal(@RequestHeader("Authorization") String idToken, @RequestBody Meal meal) {
        try {
            // Verify the Firebase ID token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            // Save meal data to Firestore under the user's UID
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> future = db.collection("users").document(uid)
                .collection("meals").add(meal);

            return ResponseEntity.ok("Meal logged at " + future.get().getUpdateTime());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}

