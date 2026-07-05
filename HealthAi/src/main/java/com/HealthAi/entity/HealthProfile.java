package com.HealthAi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.query.sqm.tree.from.DowncastLocation;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="health_profile")
public class HealthProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private Double weight;

    private Double height;
    private Integer age;
    private String gender;
    private String activityLevel;
    private String goal;

    private Double bmi;
    private Integer dailyCalorieTarget;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateBMI();
        calculateCalories();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
        calculateBMI();
        calculateCalories();
    }

    // BMI automatic calcukares hoga
    private void calculateBMI() {
        if (height != null && weight != null && height > 0) {
            double heightInMeters = height / 100;
            this.bmi = Math.round(
                    (weight / (heightInMeters * heightInMeters)) * 10.0) / 10.0;
        }
    }

    // Daily calories automatically calculate hoga
    private void calculateCalories() {
        if (weight != null && height != null && age != null && gender != null) {
            double bmr;
            if ("MALE".equals(gender)) {
                bmr = 88.362 + (13.397 * weight) +
                        (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) +
                        (3.098 * height) - (4.330 * age);
            }

            double multiplier = switch (activityLevel) {
                case "SEDENTARY" -> 1.2;
                case "ACTIVE" -> 1.55;
                case "VERY_ACTIVE" -> 1.725;
                default -> 1.2;
            };

            double maintenance = bmr * multiplier;

            this.dailyCalorieTarget = (int) switch (
                    goal != null ? goal : "MAINTAIN") {
                case "LOSE_WEIGHT" -> maintenance - 500;
                case "GAIN_MUSCLE" -> maintenance + 300;
                default -> maintenance;
            };

        }
    }
}
