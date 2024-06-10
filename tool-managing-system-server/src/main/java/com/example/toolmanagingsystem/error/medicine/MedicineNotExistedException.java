package com.example.toolmanagingsystem.error.medicine;

import com.example.toolmanagingsystem.error.BusinessError;

public class MedicineNotExistedException extends BusinessError
{
    public MedicineNotExistedException()
    {
        super("MEDICINE_NOT_EXISTED", "등록된 제품이 없습니다.", null);
    }
}
