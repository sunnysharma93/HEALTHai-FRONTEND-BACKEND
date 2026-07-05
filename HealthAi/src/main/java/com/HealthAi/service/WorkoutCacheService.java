package com.HealthAi.service;

import com.HealthAi.dto.WorkoutStatsResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String STATS_PREFIX = "workout:stats:";
    private static final long TTL = 30; // 30 minutes

    public WorkoutStatsResponse getCachedStats(String email) {
        try {
            String cached = redisTemplate.opsForValue()
                    .get(STATS_PREFIX + email);
            if (cached != null) {
                log.info("Stats cache hit: {}", email);
                return objectMapper.readValue(
                        cached, WorkoutStatsResponse.class);
            }
        } catch (Exception e) {
            log.error("Cache read error: {}", e.getMessage());
        }
        return null;
    }

    public void cacheStats(String email,
                           WorkoutStatsResponse stats) {
        try {
            String json = objectMapper.writeValueAsString(stats);
            redisTemplate.opsForValue().set(
                    STATS_PREFIX + email,
                    json,
                    TTL,
                    TimeUnit.MINUTES
            );
            log.info("Stats cached: {}", email);
        } catch (Exception e) {
            log.error("Cache write error: {}", e.getMessage());
        }
    }

    public void evictStats(String email) {
        redisTemplate.delete(STATS_PREFIX + email);
        log.info("Stats cache evicted: {}", email);
    }
}