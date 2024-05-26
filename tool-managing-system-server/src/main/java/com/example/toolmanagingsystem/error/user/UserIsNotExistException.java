package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserIsNotExistException extends BusinessError
{
    public UserIsNotExistException()
    {
        super("USER_IS_NOT_EXIST", "해당 User가 존재하지 않습니다.", null);
    }
}
