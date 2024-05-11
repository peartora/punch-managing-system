package com.example.toolmanagingsystem.service.userService.exception;

import com.example.toolmanagingsystem.error.BusinessError;

public class PasswordNotSameException extends RuntimeException
{
    public PasswordNotSameException(String message)
    {
        super(message);
    }
}
