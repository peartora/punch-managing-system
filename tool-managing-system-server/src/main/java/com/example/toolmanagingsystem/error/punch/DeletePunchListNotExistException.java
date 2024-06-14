package com.example.toolmanagingsystem.error.punch;

import com.example.toolmanagingsystem.error.BusinessError;

public class DeletePunchListNotExistException extends BusinessError {
    public DeletePunchListNotExistException() {
        super("PUNCH_DELETE_HISTORY_NOT_EXIST", "펀치 삭제 이력이 없습니다.", null);
    }
}
