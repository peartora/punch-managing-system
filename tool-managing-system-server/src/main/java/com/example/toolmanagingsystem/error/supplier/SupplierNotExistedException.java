package com.example.toolmanagingsystem.error.supplier;

import com.example.toolmanagingsystem.error.BusinessError;

public class SupplierNotExistedException extends BusinessError
{
    public SupplierNotExistedException()
    {
        super("SUPPLIER_NOT_EXISTED", "등록된 공급업체가 없습니다.", null);
    }
}
