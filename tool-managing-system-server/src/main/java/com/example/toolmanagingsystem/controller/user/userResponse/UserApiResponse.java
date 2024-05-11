package com.example.toolmanagingsystem.controller.user.userController.userResponse;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserApiResponse
{
    private String username;
    private boolean result;
    private LocalDateTime timeStamp = LocalDateTime.now();
    @Nullable
    private RuntimeException exception;

    public static UserApiResponse success(String username)
    {
        UserApiResponse response = new UserApiResponse();
        response.setResult(true);
        response.setUsername(username);
        return response;
    }

    public static UserApiResponse fail(RuntimeException exception)
    {
        UserApiResponse response = new UserApiResponse();
        response.result = false;
        response.exception = exception;
        return response;
    }
}
