package com.example.toolmanagingsystem.error.punch;

import com.example.toolmanagingsystem.error.BusinessError;

public class PunchIdNotExistedException extends BusinessError {
    public PunchIdNotExistedException () {
        super("PUNCH_ID_NOT_EXISTED", "해당 펀치가 존재 하지 않습니다.", null);
    }
}
