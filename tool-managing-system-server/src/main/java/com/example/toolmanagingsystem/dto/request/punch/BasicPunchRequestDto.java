package com.example.toolmanagingsystem.dto.request.punch;

import lombok.Data;

@Data
public abstract class BasicPunchRequestDto {

    private String punchId;
    private String supplierName;
    private String medicineName;
    private String medicineType;
    private String punchPosition;
}
