import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) throws IOException {
        // Initialize Firebase
        ClassPathResource serviceAccount = new ClassPathResource("serviceAccountKey.json");

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
            .build();

        FirebaseApp.initializeApp(options);

        SpringApplication.run(BackendApplication.class, args);
    }
}

