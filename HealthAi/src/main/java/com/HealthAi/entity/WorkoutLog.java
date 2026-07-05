package com.HealthAi.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private Integer sets;
    private Integer reps;
    private Double weight;        // kg (optional — cardio mein null)
    private Integer durationMins; // minutes
    private Double caloriesBurned; // auto calculated

    private String notes;
    private LocalDate workoutDate;
    private LocalDateTime loggedAt;

    @PrePersist
    public void prePersist() {
        loggedAt = LocalDateTime.now();
        if (workoutDate == null) {
            workoutDate = LocalDate.now();
        }
        calculateCalories();
    }

    @PreUpdate
    public void preUpdate() {
        calculateCalories();
    }

    // Calories auto calculate
    private void calculateCalories() {
        if (exercise != null &&
                exercise.getCaloriesPerMin() != null &&
                durationMins != null) {
            this.caloriesBurned =
                    exercise.getCaloriesPerMin() * durationMins;
        }
    }
}