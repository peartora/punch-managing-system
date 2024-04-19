package com.example.toolmanagingsystem.service.userService.exception;

import com.example.toolmanagingsystem.error.BusinessError;

public class PasswordNotSameException extends BusinessError
{
    public PasswordNotSameException()
    {
        super("PASSWORD_NOT_SAME", "Password not same", null);
    }
}
