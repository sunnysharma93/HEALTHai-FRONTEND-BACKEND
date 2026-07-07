package com.HealthAi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor  // ← Yeh add karo
public class WorkoutStatsResponse {
    private Integer totalWorkouts;
    private Double totalCaloriesBurned;
    private Integer totalDurationMins;
    private String mostDoneExercise;
    private String favoriteCategory;
    private Double averageCaloriesPerWorkout;
    private Integer currentStreak;
}
