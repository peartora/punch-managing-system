package com.example.toolmanagingsystem.service.userService.exception;

import com.example.toolmanagingsystem.error.BusinessError;

public class PasswordLengthIsNotEnoughException extends BusinessError
{
    public PasswordLengthIsNotEnoughException()
    {
        super("PASSWORD_LENGTH_IS_NOT_ENOUGH", "Password length is not enough", null);
    }
}
