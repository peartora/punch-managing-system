package com.example.toolmanagingsystem.dto.request.punch;

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

    public PunchRegisterRequestDto()
    {
        super();
    }

    @Override
    public String toString() {
        return "PunchRegisterRequestDto{" +
                "punchId='" + this.punchId + '\'' +
                ", date=" + this.date +
                ", punchPosition='" + this.punchPosition + '\'' +
                ", supplier='" + this.supplier + '\'' +
                ", medicine='" + this.medicine + '\'' +
                ", medicineType='" + this.medicineType + '\'' +
                '}';
    }
}
