package com.mealCraft.controller;

import com.mealCraft.model.User;

import com.mealCraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;



@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/profile - Secure endpoint, requires JWT
    @GetMapping
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("location", user.getLocation());
        profile.put("profilePicUrl", user.getProfilePicUrl()); // ✅ Add this line

        return ResponseEntity.ok(profile);
    }

    
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Update fields if provided
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("location")) {
            user.setLocation(updates.get("location"));
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully.");
    }
    
    @PutMapping("/pic")
    public ResponseEntity<?> updateProfilePic(
        @RequestParam("file") MultipartFile file,
        Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        try {
            // Save to /uploads folder
            String folder = System.getProperty("user.dir") + "/uploads/";
            File directory = new File(folder);
            if (!directory.exists()) directory.mkdirs();

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(folder + filename);
            Files.write(path, file.getBytes());

            String imageUrl = "http://localhost:8080/uploads/" + filename;

            user.setProfilePicUrl(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("profilePicUrl", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file");
        }
    }


}
