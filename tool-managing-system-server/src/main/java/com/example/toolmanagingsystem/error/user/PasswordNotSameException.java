package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class PasswordNotSameException extends BusinessError
{
    public PasswordNotSameException()
    {
        super("USER_PASSWORD_NOT_SAME", "입력한 2개의 Password가 다릅니다.", null);
    }
}
