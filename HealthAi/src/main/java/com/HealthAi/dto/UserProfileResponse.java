package com.HealthAi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String email;
    private String role;

    // Health data
    private Double weight;
    private Double height;
    private Integer age;
    private String gender;
    private String activityLevel;
    private String goal;
    private Double bmi;
    private Integer dailyCalorieTarget;
    private String bmiCategory;

    // BMI category automatically set hogi
    public String getBmiCategory() {
        if (bmi == null) return "Not calculated";
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25.0) return "Normal";
        if (bmi < 30.0) return "Overweight";
        return "Obese";
    }
}