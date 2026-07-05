package com.HealthAi.service;

import com.HealthAi.dto.HealthProfileRequest;
import com.HealthAi.dto.UserProfileResponse;
import com.HealthAi.entity.HealthProfile;
import com.HealthAi.entity.User;
import com.HealthAi.exception.CustomException;
import com.HealthAi.repository.HealthProfileRepository;
import com.HealthAi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final UserCacheService userCacheService;

    // Profile get karo
    public UserProfileResponse getProfile(String email) {
        UserProfileResponse cached = userCacheService
                .getCachedProfile(email);
        if (cached != null) {
            log.info("Cache se mila: {}", email);
            return cached;
        }

        User user = getUser(email);
        HealthProfile health = healthProfileRepository
                .findByUser(user).orElse(null);

        UserProfileResponse response = buildResponse(user, health);
        userCacheService.cacheProfile(email, response);
        return response;
    }

    // Health data save karo
    @Transactional
    public UserProfileResponse saveHealthProfile(
            String email, HealthProfileRequest request) {

        User user = getUser(email);

        HealthProfile health = healthProfileRepository
                .findByUser(user)
                .orElse(new HealthProfile());

        health.setUser(user);
        health.setWeight(request.getWeight());
        health.setHeight(request.getHeight());
        health.setAge(request.getAge());
        health.setGender(request.getGender());
        health.setActivityLevel(request.getActivityLevel());
        health.setGoal(request.getGoal());

        healthProfileRepository.save(health);
        userCacheService.evictProfile(email);

        return getProfile(email);
    }

    // Name update karo
    @Transactional
    public UserProfileResponse updateProfile(
            String email, String name) {

        User user = getUser(email);
        user.setName(name);
        userRepository.save(user);
        userCacheService.evictProfile(email);

        return getProfile(email);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new CustomException(404 , "User not Found"));
    }

    private UserProfileResponse buildResponse(
            User user, HealthProfile health) {
        return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                health != null ? health.getWeight() : null,
                health != null ? health.getHeight() : null,
                health != null ? health.getAge() : null,
                health != null ? health.getGender() : null,
                health != null ? health.getActivityLevel() : null,
                health != null ? health.getGoal() : null,
                health != null ? health.getBmi() : null,
                health != null ? health.getDailyCalorieTarget() : null,
                null
        );
    }
}