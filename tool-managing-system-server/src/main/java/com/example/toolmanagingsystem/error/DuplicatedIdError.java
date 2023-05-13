package com.example.toolmanagingsystem.error;

public class DuplicatedIdError extends BusinessError
{
    public DuplicatedIdError(Object detail)
    {
        super("DUPLICATED_ID", "중복 에러가 발생했습니다.", detail);
    }
}
