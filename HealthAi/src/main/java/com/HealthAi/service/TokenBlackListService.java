package com.HealthAi.service;

import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.descriptor.web.SecurityRoleRef;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlackListService {

    private final RedisTemplate<String , String> redis;

    public void blacklistToken(String token , long expirationMs){
        redis.opsForValue().set(
                "blacklist:" + token,
                "true",
                expirationMs,
                TimeUnit.MILLISECONDS
        );
    }
    public boolean isBlacklisted(String token){
        return Boolean.TRUE.equals(
                redis.hasKey("blacklist" + token)
        );
    }
}
