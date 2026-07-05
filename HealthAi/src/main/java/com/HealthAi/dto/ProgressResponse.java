package com.HealthAi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class ProgressResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalWorkouts;
    private Double totalCalories;
    private List<WorkoutResponse> workouts;
    private String progressMessage;
}