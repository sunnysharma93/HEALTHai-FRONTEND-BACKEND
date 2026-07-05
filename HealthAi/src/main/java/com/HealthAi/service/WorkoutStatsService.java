package com.HealthAi.service;

import com.HealthAi.dto.WorkoutStatsResponse;
import com.HealthAi.entity.User;
import com.HealthAi.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutStatsService {

    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutCacheService workoutCacheService;

    public WorkoutStatsResponse getStats(
            User user, String email) {

        // Cache check
        WorkoutStatsResponse cached =
                workoutCacheService.getCachedStats(email);
        if (cached != null) return cached;

        // DB se calculate karo
        Integer totalWorkouts = workoutLogRepository
                .findByUserOrderByWorkoutDateDesc(user).size();

        Double totalCalories = workoutLogRepository
                .getTotalCaloriesByUser(user);
        if (totalCalories == null) totalCalories = 0.0;

        Integer totalDuration = workoutLogRepository
                .getTotalDurationByUser(user);
        if (totalDuration == null) totalDuration = 0;

        // Most done exercise
        String mostDone = "N/A";
        List<Object[]> exercises = workoutLogRepository
                .getMostDoneExercise(user);
        if (!exercises.isEmpty()) {
            mostDone = (String) exercises.get(0)[0];
        }

        // Favorite category
        String favCategory = "N/A";
        List<Object[]> categories = workoutLogRepository
                .getCategoryCount(user);
        if (!categories.isEmpty()) {
            favCategory = (String) categories.get(0)[0];
        }

        // Average calories
        double avgCalories = totalWorkouts > 0
                ? Math.round((totalCalories / totalWorkouts) * 10.0) / 10.0
                : 0.0;

        // Streak calculate karo
        int streak = calculateStreak(user);

        WorkoutStatsResponse stats = new WorkoutStatsResponse(
                totalWorkouts,
                Math.round(totalCalories * 10.0) / 10.0,
                totalDuration,
                mostDone,
                favCategory,
                avgCalories,
                streak
        );

        // Cache karo
        workoutCacheService.cacheStats(email, stats);

        return stats;
    }

    // Streak — consecutive workout days
    private int calculateStreak(User user) {
        List<LocalDate> dates = workoutLogRepository
                .getWorkoutDates(user);

        if (dates.isEmpty()) return 0;

        int streak = 1;
        LocalDate today = LocalDate.now();

        // Aaj ya kal se streak shuru honi chahiye
        if (ChronoUnit.DAYS.between(dates.get(0), today) > 1) {
            return 0;
        }

        for (int i = 0; i < dates.size() - 1; i++) {
            long diff = ChronoUnit.DAYS.between(
                    dates.get(i + 1), dates.get(i));
            if (diff == 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
}