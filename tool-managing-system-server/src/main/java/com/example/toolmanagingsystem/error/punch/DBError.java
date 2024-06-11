package com.example.toolmanagingsystem.error.punch;

import com.example.toolmanagingsystem.error.BusinessError;

public class DBError extends BusinessError {
    public DBError() {
        super("DB_ERROR", "DB 처리중 error 발생 하였습니다.", null);
    }
}
