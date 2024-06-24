package com.example.toolmanagingsystem.error;

public class UnknownInputValidationException extends BusinessError{
    public UnknownInputValidationException()
    {
        super("UNKNOWN_INPUT_VALID_EXCEPTION", "확인 되지 않은 error_code 입니다.", null);
    }
}
