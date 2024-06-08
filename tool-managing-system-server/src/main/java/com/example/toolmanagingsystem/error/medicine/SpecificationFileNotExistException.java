package com.example.toolmanagingsystem.error.medicine;

import com.example.toolmanagingsystem.error.BusinessError;

public class SpecificationFileNotExistException extends BusinessError
{
    public SpecificationFileNotExistException()
    {
        super("SPECIFICATION_FILE_NOT_EXIST", "해당 파일이 존재하지 않습니다.", null);
    }
}
