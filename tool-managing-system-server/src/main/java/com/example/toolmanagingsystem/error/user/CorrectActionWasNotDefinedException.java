package com.example.toolmanagingsystem.error.user;

import com.example.toolmanagingsystem.error.BusinessError;

public class CorrectActionWasNotDefinedException extends BusinessError
{
    public CorrectActionWasNotDefinedException()
    {
        super("NOT_CORRECT_ACTION", "정의 되지 않았거나, action이 생략 되었습니다.", null);
    }

}
