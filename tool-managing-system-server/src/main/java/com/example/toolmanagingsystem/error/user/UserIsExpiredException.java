package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserIsExpiredException extends BusinessError
{
    public UserIsExpiredException()
    {
        super("USER_IS_EXPIRED", "해당 User의 계정이 만료되었습니다.", null);
    }
}
