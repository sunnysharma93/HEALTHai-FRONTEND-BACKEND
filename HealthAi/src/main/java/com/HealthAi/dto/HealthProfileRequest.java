package com.HealthAi.dto;

import lombok.Data;

@Data
public class HealthProfileRequest {

    private Double weight;
    private Double height;
    private Integer age;
    private String gender;
    private String activityLevel;
    private String goal;

}
