package com.example.toolmanagingsystem.error.medicine;

import com.example.toolmanagingsystem.error.BusinessError;

public class NoMedicineRegisteredException extends BusinessError
{
    public NoMedicineRegisteredException()
    {
        super("NO_MEDICINE_REGISTERED", "등록된 약이 없습니다.", null);
    }
}
