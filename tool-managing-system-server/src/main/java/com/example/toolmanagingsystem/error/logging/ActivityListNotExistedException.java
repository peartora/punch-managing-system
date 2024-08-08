package com.example.toolmanagingsystem.error.logging;

import com.example.toolmanagingsystem.error.BusinessError;

public class ActivityListNotExistedException extends BusinessError
{
    public ActivityListNotExistedException()
    {
        super("ACTIVITY_LIST_NOT_EXISTED", "등록된 activity가 없습니다.", null);
    }
}
