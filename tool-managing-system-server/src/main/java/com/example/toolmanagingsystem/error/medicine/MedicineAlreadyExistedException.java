package com.example.toolmanagingsystem.error.medicine;

import com.example.toolmanagingsystem.error.BusinessError;

public class MedicineAlreadyExistedException extends BusinessError
{
    public MedicineAlreadyExistedException()
    {
        super("MEDICINE_NAME_ALREADY_EXISTED", "이미 존재하는 medicine 이름 입니다.", null);
    }
}
