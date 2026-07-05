package com.HealthAi.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WorkoutRequest {
    private Long exerciseId;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer durationMins;
    private String notes;
    private LocalDate workoutDate;
}