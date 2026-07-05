package com.HealthAi.controller;

import com.HealthAi.dto.ProgressResponse;
import com.HealthAi.dto.WorkoutRequest;
import com.HealthAi.dto.WorkoutResponse;
import com.HealthAi.dto.WorkoutStatsResponse;
import com.HealthAi.service.JwtService;
import com.HealthAi.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/workout")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;
    private final JwtService jwtService;

    // Workout log karo
    @PostMapping("/log")
    public ResponseEntity<WorkoutResponse> logWorkout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody WorkoutRequest request) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                workoutService.logWorkout(email, request));
    }

    // Aaj ke workouts
    @GetMapping("/today")
    public ResponseEntity<List<WorkoutResponse>> getTodayWorkouts(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                workoutService.getTodayWorkouts(email));
    }

    // Sare workouts
    @GetMapping("/all")
    public ResponseEntity<List<WorkoutResponse>> getAllWorkouts(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                workoutService.getAllWorkouts(email));
    }

    // Stats
    @GetMapping("/stats")
    public ResponseEntity<WorkoutStatsResponse> getStats(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                workoutService.getStats(email));
    }

    // Progress — date range
    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                workoutService.getProgress(email, startDate, endDate));
    }

    // Workout delete karo
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkout(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String email = extractEmail(authHeader);
        workoutService.deleteWorkout(email, id);
        return ResponseEntity.ok("Workout delete ho gaya!");
    }

    private String extractEmail(String authHeader) {
        return jwtService.extractEmail(authHeader.substring(7));
    }
}