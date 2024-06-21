package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserLoginPasswordNotCorrectException extends BusinessError {
    public UserLoginPasswordNotCorrectException()
    {
        super("LOGIN_PASSWORD_IS_NOT_CORRECT", "입력한 비밀번호가 틀렸습니다.", null);
    }

}
