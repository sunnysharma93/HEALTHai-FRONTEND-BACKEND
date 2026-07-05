package com.HealthAi.event;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutEvent {
    private String email;
    private String exerciseName;
    private String category;
    private Integer durationMins;
    private Double caloriesBurned;
    private String timestamp;
}