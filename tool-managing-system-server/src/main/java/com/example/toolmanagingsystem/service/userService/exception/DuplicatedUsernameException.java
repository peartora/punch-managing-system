package com.example.toolmanagingsystem.service.userService.exception;

public class DuplicatedUsernameException extends RuntimeException
{
    public DuplicatedUsernameException(String message)
    {
        super(message);
    }
}
