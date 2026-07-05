package com.HealthAi.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final int statusCode;

    public CustomException(int statuscode , String message) {
        super(message);
        this.statusCode = statuscode;
    }
}
