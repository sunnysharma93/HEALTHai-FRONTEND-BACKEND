package com.HealthAi.service;

import com.HealthAi.dto.UserProfileResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PREFIX = "profile:";
    private static final long TTL = 10; // 10 minutes

    // Cache se profile lo
    public UserProfileResponse getCachedProfile(String email) {
        try {
            String cached = redisTemplate.opsForValue()
                    .get(PREFIX + email);
            if (cached != null) {
                return objectMapper.readValue(
                        cached, UserProfileResponse.class);
            }
        } catch (Exception e) {
            log.error("Cache read error: {}", e.getMessage());
        }
        return null;
    }

    // Cache mein profile save karo
    public void cacheProfile(String email,
                             UserProfileResponse profile) {
        try {
            String json = objectMapper
                    .writeValueAsString(profile);
            redisTemplate.opsForValue().set(
                    PREFIX + email,
                    json,
                    TTL,
                    TimeUnit.MINUTES
            );
        } catch (Exception e) {
            log.error("Cache write error: {}", e.getMessage());
        }
    }

    // Cache hatao (update pe)
    public void evictProfile(String email) {
        redisTemplate.delete(PREFIX + email);
    }
}