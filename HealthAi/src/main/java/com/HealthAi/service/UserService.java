package com.HealthAi.service;

import com.HealthAi.dto.RegisterRequest;
import com.HealthAi.entity.User;
import com.HealthAi.exception.CustomException;
import com.HealthAi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + email));
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(
                request.getEmail()).isPresent()) {
            throw new CustomException(
                    400, "Email already registered !");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(
                request.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);

    }
}
