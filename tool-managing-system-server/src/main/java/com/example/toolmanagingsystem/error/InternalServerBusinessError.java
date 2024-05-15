package com.example.toolmanagingsystem.error;

public class InternalServerBusinessError extends BusinessError
{
    public InternalServerBusinessError(Exception e)
    {
        super("INTERNAL_SERVER_ERROR", "서버 내부 에러가 발생했습니다.", e);
    }
}
