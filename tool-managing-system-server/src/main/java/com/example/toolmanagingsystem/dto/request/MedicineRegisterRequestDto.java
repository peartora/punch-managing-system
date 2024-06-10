package com.example.toolmanagingsystem.dto.request;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MedicineRegisterRequestDto
{
    private String medicine;
    private LocalDateTime timeDate;
    private String filePath;
}
