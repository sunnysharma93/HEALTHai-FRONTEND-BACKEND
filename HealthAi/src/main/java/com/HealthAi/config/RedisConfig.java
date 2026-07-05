package com.HealthAi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class RedisConfig {

    @Bean
    @Primary
    public RedisTemplate<String, String> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, String> template =
                new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(
                new StringRedisSerializer());
        template.setValueSerializer(
                new StringRedisSerializer());
        return template;
    }

    @Bean  // ← Yeh add karo
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(
                new JavaTimeModule()); // LocalDate support
        mapper.disable(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}