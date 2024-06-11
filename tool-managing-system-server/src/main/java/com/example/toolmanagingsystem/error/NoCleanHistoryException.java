package com.example.toolmanagingsystem.error;

public class NoCleanHistoryException extends BusinessError{
    public NoCleanHistoryException()
    {
        super("NO_CLEANHISTORY_EXISTED", "선택 된 펀치가 없습니다.", null);
    }

}
