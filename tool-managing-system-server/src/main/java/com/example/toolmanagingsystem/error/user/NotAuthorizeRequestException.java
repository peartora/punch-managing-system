package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class NotAuthorizeRequestException extends BusinessError {
    public NotAuthorizeRequestException()
    {
        super("USER_IS_NOT_AUTHORIZED", "신규 password와 현재 passwor가 동일 합니다.", null);
    }
}
