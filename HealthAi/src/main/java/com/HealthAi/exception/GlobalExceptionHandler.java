package com.HealthAi.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustom(CustomException ex){
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErrorResponse(
                        ex.getStatusCode(),
                        ex.getMessage(),
                        LocalDateTime.now().toString()));

    }

    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex){
        return ResponseEntity.status(401)
                .body(new ErrorResponse(
                        401,
                        "Email or password is wrong",
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UsernameNotFoundException ex){
        return ResponseEntity.status(404)
                .body(new ErrorResponse(
                        404,
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }
}
