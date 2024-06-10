package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PunchRegisterRequestDto
{
    private String punchId;
    private LocalDate date;
    private String punchPosition;
    private String supplier;
    private String medicine;
    private String medicineType;

    @Override
    public String toString() {
        return "PunchRegisterRequestDto{" +
                "punchId='" + punchId + '\'' +
                ", date=" + date +
                ", punchPosition='" + punchPosition + '\'' +
                ", supplier='" + supplier + '\'' +
                ", medicine='" + medicine + '\'' +
                ", medicineType='" + medicineType + '\'' +
                '}';
    }
}
