package com.example.toolmanagingsystem.error.punch;

import com.example.toolmanagingsystem.error.BusinessError;

public class PunchIdAlreadyExistedException extends BusinessError
{
    public PunchIdAlreadyExistedException()
    {
        super("PUNCH_ID_ALREADY_EXISTED", "이미 존재하는 Punch ID 입니다.", null);
    }
}
