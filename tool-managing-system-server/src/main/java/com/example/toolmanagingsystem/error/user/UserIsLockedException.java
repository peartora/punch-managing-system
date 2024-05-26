package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserIsLockedException extends BusinessError
{
    public UserIsLockedException()
    {
        super("USER_IS_LOCKED", "해당 User가 Lock되어 있습니다.", null);
    }
}
