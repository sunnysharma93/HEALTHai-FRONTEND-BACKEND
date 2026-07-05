package com.HealthAi.service;

import com.HealthAi.event.UserActivityEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserActivityConsumer {

    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "user-activity",
            groupId = "healthai-group"
    )
    public void consume(String message) {
        try {
            UserActivityEvent event = objectMapper
                    .readValue(message, UserActivityEvent.class);

            log.info("✅ Activity received: {} - {} at {}",
                    event.getEmail(),
                    event.getActivityType(),
                    event.getTimeStamp());
        } catch (Exception e) {
            log.error("Consumer error: {}", e.getMessage());
        }
    }
}