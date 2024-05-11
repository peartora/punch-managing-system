package com.example.toolmanagingsystem.service.userService.exception;

import com.example.toolmanagingsystem.error.BusinessError;

public class PasswordLengthIsNotEnoughException extends RuntimeException
{
    public PasswordLengthIsNotEnoughException(String message)
    {
        super(message);
    }
}
