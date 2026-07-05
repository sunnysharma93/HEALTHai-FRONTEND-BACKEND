package com.HealthAi.repository;

import com.HealthAi.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository
        extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategory(String category);
    List<Exercise> findByMuscleGroup(String muscleGroup);
    Optional<Exercise> findByNameIgnoreCase(String name);
    List<Exercise> findByDifficulty(String difficulty);
}