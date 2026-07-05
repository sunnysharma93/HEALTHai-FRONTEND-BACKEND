package com.HealthAi.repository;

import com.HealthAi.entity.User;
import com.HealthAi.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutLogRepository
        extends JpaRepository<WorkoutLog, Long> {

    // Date range se workouts lo
    List<WorkoutLog> findByUserAndWorkoutDateBetween(
            User user, LocalDate start, LocalDate end);

    // Aaj ke workouts
    List<WorkoutLog> findByUserAndWorkoutDate(
            User user, LocalDate date);

    // Sare workouts
    List<WorkoutLog> findByUserOrderByWorkoutDateDesc(
            User user);

    // Total calories burned
    @Query("SELECT SUM(w.caloriesBurned) " +
            "FROM WorkoutLog w WHERE w.user = :user")
    Double getTotalCaloriesByUser(@Param("user") User user);

    // Total duration
    @Query("SELECT SUM(w.durationMins) " +
            "FROM WorkoutLog w WHERE w.user = :user")
    Integer getTotalDurationByUser(@Param("user") User user);

    // Most done exercise
    @Query("SELECT w.exercise.name, COUNT(w) as cnt " +
            "FROM WorkoutLog w WHERE w.user = :user " +
            "GROUP BY w.exercise.name " +
            "ORDER BY cnt DESC")
    List<Object[]> getMostDoneExercise(@Param("user") User user);

    // Streak calculation
    @Query("SELECT DISTINCT w.workoutDate " +
            "FROM WorkoutLog w WHERE w.user = :user " +
            "ORDER BY w.workoutDate DESC")
    List<LocalDate> getWorkoutDates(@Param("user") User user);

    // Category wise count
    @Query("SELECT w.exercise.category, COUNT(w) " +
            "FROM WorkoutLog w WHERE w.user = :user " +
            "GROUP BY w.exercise.category " +
            "ORDER BY COUNT(w) DESC")
    List<Object[]> getCategoryCount(@Param("user") User user);
}