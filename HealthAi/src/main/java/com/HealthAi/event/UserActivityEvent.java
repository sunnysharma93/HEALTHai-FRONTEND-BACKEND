package com.HealthAi.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityEvent {

    private String email;
    private String activityType;
    private String details;
    private String timeStamp;

}
