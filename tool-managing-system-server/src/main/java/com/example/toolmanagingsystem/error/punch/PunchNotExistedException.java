package com.example.toolmanagingsystem.error.punch;

import com.example.toolmanagingsystem.error.BusinessError;

public class PunchNotExistedException extends BusinessError {

    public PunchNotExistedException()
    {
        super("PUNCH_ID_NOT_EXIST", "등록 된 펀치가 없습니다.", null);
    }
}
