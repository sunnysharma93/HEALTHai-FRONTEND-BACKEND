package com.HealthAi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class WorkoutStatsResponse {
    private Integer totalWorkouts;
    private Double totalCaloriesBurned;
    private Integer totalDurationMins;
    private String mostDoneExercise;
    private String favoriteCategory;
    private Double averageCaloriesPerWorkout;
    private Integer currentStreak; // days
}