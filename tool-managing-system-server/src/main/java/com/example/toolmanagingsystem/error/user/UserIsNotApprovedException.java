package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserIsNotApprovedException extends BusinessError
{
    public UserIsNotApprovedException()
    {
        super("USER_IS_NOT_APPROVED", "해당 User가 승인되지 않았습니다.", null);
    }
}
