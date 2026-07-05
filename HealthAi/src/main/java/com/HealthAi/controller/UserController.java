package com.HealthAi.controller;

import com.HealthAi.dto.HealthProfileRequest;
import com.HealthAi.dto.UserProfileResponse;
import com.HealthAi.service.JwtService;
import com.HealthAi.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;
    private final JwtService jwtService;

    // Profile dekho
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                userProfileService.getProfile(email));
    }

    // Health data save karo
    @PostMapping("/health")
    public ResponseEntity<UserProfileResponse> saveHealth(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody HealthProfileRequest request) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                userProfileService.saveHealthProfile(email, request));
    }

    // Name update karo
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String name) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                userProfileService.updateProfile(email, name));
    }

    private String extractEmail(String authHeader) {
        return jwtService.extractEmail(authHeader.substring(7));
    }
}