package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class NewPasswordSameWithCurrentPasswordException extends BusinessError
{
    public NewPasswordSameWithCurrentPasswordException()
    {
        super("NEW_PASSWORD_SAME_WITH_CURRENT_PASSWORD", "신규 password와 현재 passwor가 동일 합니다.", null);
    }
}
