package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;
import com.example.toolmanagingsystem.service.userService.UserService;

public class PasswordLengthIsNotEnoughException extends BusinessError
{
    public PasswordLengthIsNotEnoughException()
    {
        super("USER_PASSWORD_SHORT", "Password가 기준 길이보다 짧습니다.", null);
    }
}
