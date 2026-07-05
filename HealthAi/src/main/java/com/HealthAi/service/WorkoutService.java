package com.HealthAi.service;

import com.HealthAi.dto.ProgressResponse;
import com.HealthAi.dto.WorkoutRequest;
import com.HealthAi.dto.WorkoutResponse;
import com.HealthAi.dto.WorkoutStatsResponse;
import com.HealthAi.entity.Exercise;
import com.HealthAi.entity.User;
import com.HealthAi.entity.WorkoutLog;
import com.HealthAi.exception.CustomException;
import com.HealthAi.repository.ExerciseRepository;
import com.HealthAi.repository.UserRepository;
import com.HealthAi.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutService {

    private final WorkoutLogRepository workoutLogRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final WorkoutStatsService workoutStatsService;
    private final WorkoutCacheService workoutCacheService;

    @Transactional
    public WorkoutResponse logWorkout(
            String email, WorkoutRequest request) {

        User user = getUser(email);
        Exercise exercise = exerciseRepository
                .findById(request.getExerciseId())
                .orElseThrow(() ->
                        new CustomException(404 , "Exercise nahi mili!"));

        WorkoutLog workoutLog = new WorkoutLog();
        workoutLog.setUser(user);
        workoutLog.setExercise(exercise);
        workoutLog.setSets(request.getSets());
        workoutLog.setReps(request.getReps());
        workoutLog.setWeight(request.getWeight());
        workoutLog.setDurationMins(request.getDurationMins());
        workoutLog.setNotes(request.getNotes());
        workoutLog.setWorkoutDate(
                request.getWorkoutDate() != null
                        ? request.getWorkoutDate()
                        : LocalDate.now());

        WorkoutLog saved = workoutLogRepository.save(workoutLog);
        workoutCacheService.evictStats(email);

        log.info("Workout logged: {} - {}", email,
                exercise.getName());

        return buildResponse(saved);
    }

    public List<WorkoutResponse> getTodayWorkouts(String email) {
        User user = getUser(email);
        return workoutLogRepository
                .findByUserAndWorkoutDate(user, LocalDate.now())
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    public List<WorkoutResponse> getAllWorkouts(String email) {
        User user = getUser(email);
        return workoutLogRepository
                .findByUserOrderByWorkoutDateDesc(user)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    public WorkoutStatsResponse getStats(String email) {
        User user = getUser(email);
        return workoutStatsService.getStats(user, email);
    }

    public ProgressResponse getProgress(
            String email,
            LocalDate startDate,
            LocalDate endDate) {

        User user = getUser(email);
        List<WorkoutLog> logs = workoutLogRepository
                .findByUserAndWorkoutDateBetween(
                        user, startDate, endDate);

        List<WorkoutResponse> workouts = logs.stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());

        Double totalCalories = logs.stream()
                .mapToDouble(w -> w.getCaloriesBurned() != null
                        ? w.getCaloriesBurned() : 0)
                .sum();

        String message = generateProgressMessage(
                logs.size(), totalCalories);

        return new ProgressResponse(
                startDate, endDate,
                logs.size(),
                Math.round(totalCalories * 10.0) / 10.0,
                workouts,
                message
        );
    }

    @Transactional
    public void deleteWorkout(String email, Long workoutId) {
        User user = getUser(email);
        WorkoutLog workout = workoutLogRepository
                .findById(workoutId)
                .orElseThrow(() ->
                        new CustomException(404 , "Workout nahi mila!"));

        if (!workout.getUser().getId().equals(user.getId())) {
            throw new CustomException(
                   403 ,  "Yeh tumhara workout nahi hai!");
        }

        workoutLogRepository.delete(workout);
        workoutCacheService.evictStats(email);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new CustomException(404 , "User nahi mila!"));
    }

    private WorkoutResponse buildResponse(WorkoutLog log) {
        return new WorkoutResponse(
                log.getId(),
                log.getExercise().getName(),
                log.getExercise().getCategory(),
                log.getExercise().getMuscleGroup(),
                log.getSets(),
                log.getReps(),
                log.getWeight(),
                log.getDurationMins(),
                log.getCaloriesBurned(),
                log.getNotes(),
                log.getWorkoutDate()
        );
    }

    private String generateProgressMessage(
            int count, double calories) {
        if (count == 0) return "Is period mein koi workout nahi!";
        if (count < 3) return "Acchi shuruat! Aur mehnat karo!";
        if (count < 7) return "Badiya chal raha hai! Keep it up!";
        return "Ekdum solid! Tum champion ho! 🏆";
    }
}