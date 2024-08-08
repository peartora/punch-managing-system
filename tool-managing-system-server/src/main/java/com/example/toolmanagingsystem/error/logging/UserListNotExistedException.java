package com.example.toolmanagingsystem.error.logging;

import com.example.toolmanagingsystem.error.BusinessError;

public class UserListNotExistedException extends BusinessError
{
    public UserListNotExistedException()
    {
        super("USER_LIST_NOT_EXISTED", "등록된 사용자가 없습니다.", null);
    }
}
