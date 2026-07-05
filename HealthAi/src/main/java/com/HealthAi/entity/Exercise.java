package com.HealthAi.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;           // "Push Up", "Running"

    private String category;       // STRENGTH, CARDIO, FLEXIBILITY
    private String muscleGroup;    // CHEST, LEGS, BACK, FULL_BODY
    private Double caloriesPerMin; // Calories per minute burn rate
    private String difficulty;     // EASY, MEDIUM, HARD
    private String description;
}