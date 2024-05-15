package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;
import lombok.Getter;

@Getter
public class DuplicatedUsernameException extends BusinessError
{
    public DuplicatedUsernameException()
    {
        super("USER_USERNAME_DUPLICATED", "Username 중복 에러가 발생했습니다.", null);
    }
}
