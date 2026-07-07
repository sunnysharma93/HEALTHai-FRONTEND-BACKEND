package com.HealthAi.controller;

import com.HealthAi.dto.AuthResponse;
import com.HealthAi.dto.LoginRequest;
import com.HealthAi.dto.RegisterRequest;
import com.HealthAi.entity.RefreshToken;
import com.HealthAi.entity.User;
import com.HealthAi.service.JwtService;
import com.HealthAi.service.RefreshTokenService;
import com.HealthAi.service.TokenBlackListService;
import com.HealthAi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlackListService tokenBlackListService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest){
        userService.registerUser(registerRequest);
        return ResponseEntity.ok("User Register is successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = (User) userService
                .loadUserByUsername(loginRequest.getEmail());
        String accessToken = jwtService
                .generateToken(loginRequest.getEmail());
        RefreshToken refreshToken = refreshTokenService
                .createRefreshToken(loginRequest.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                user.getEmail(),
                user.getName()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody String refreshToken){
        RefreshToken verified = refreshTokenService
                .verifyRefreshToken(refreshToken);
        String newAccessToken = jwtService
                .generateToken(
                        verified.getUser().getEmail());
        return ResponseEntity.ok(new AuthResponse(
                newAccessToken,
                refreshToken,
                verified.getUser().getEmail(),
                verified.getUser().getName()
        ));

    }

    @PostMapping("/logout")
    public ResponseEntity<String>  logout(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.substring(7);
        tokenBlackListService.blacklistToken(
                token, jwtService.getExpiration());
        String email = jwtService.extractEmail(token);
        refreshTokenService.revokeToken(email);
        return ResponseEntity.ok("Logout Successfully");

    }

    @GetMapping("/profile")
    public ResponseEntity<String> profile(@RequestHeader("Authorization") String authHeader){
        String email = jwtService
                .extractEmail(authHeader.substring(7));
        return ResponseEntity.ok(
                "Welcome" + email + "it is your profile"
        );
    }
}
