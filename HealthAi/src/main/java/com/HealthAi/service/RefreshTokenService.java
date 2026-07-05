package com.HealthAi.service;

import com.HealthAi.entity.RefreshToken;
import com.HealthAi.entity.User;
import com.HealthAi.exception.CustomException;
import com.HealthAi.repository.RefreshTokenRepository;
import com.HealthAi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public RefreshToken createRefreshToken(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new CustomException(404,"user not found"));

        refreshTokenRepository.deleteByUser(user);

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(
                Instant.now().plusMillis(604800000L));
        token.setRevoked(false);

        return refreshTokenRepository.save(token);

    }


    public RefreshToken verifyRefreshToken(String token){
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(()->
                        new CustomException(401, "Refresh token invalid"));

        if (refreshToken.isRevoked()){
            throw new CustomException(
                    401,"Refresh token is revole"
            );
        }
        if(refreshToken.getExpiryDate()
                .isBefore(Instant.now())){
            refreshTokenRepository.delete(refreshToken);
            throw new CustomException(
                    401,"Refresh toke is ecpire"
                    );
        }
        return refreshToken;
    }

    @Transactional
    public void revokeToken(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->
                        new CustomException(404,"User not Found"));
        refreshTokenRepository.deleteByUser(user);
    }
}
