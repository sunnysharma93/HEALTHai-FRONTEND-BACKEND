package com.HealthAi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class WorkoutResponse {
    private Long id;
    private String exerciseName;
    private String category;
    private String muscleGroup;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer durationMins;
    private Double caloriesBurned;
    private String notes;
    private LocalDate workoutDate;
}