package com.example.toolmanagingsystem.error.supplier;

import com.example.toolmanagingsystem.error.BusinessError;

public class SupplierAlreadyExistedException extends BusinessError
{
    public SupplierAlreadyExistedException()
    {
        super("SUPPLIER_NAME_ALREADY_EXISTED", "이미 존재하는 supplier 이름 입니다.", null);
    }
}
