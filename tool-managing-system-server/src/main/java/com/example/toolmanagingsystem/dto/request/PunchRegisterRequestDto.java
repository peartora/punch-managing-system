package com.example.toolmanagingsystem.dto.request;

import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
public class PunchRegisterRequestDto
{
    private String punchId;
    private LocalDate date;
    private String punchPosition;
    private String supplier;
    private String storageLocation;
    private String medicine;
    private String medicineType;

    @Override
    public String toString() {
        return "PunchRegisterRequestDto{" +
                "punchId='" + punchId + '\'' +
                ", date=" + date +
                ", punchPosition='" + punchPosition + '\'' +
                ", supplier='" + supplier + '\'' +
                ", storageLocation='" + storageLocation + '\'' +
                ", medicine='" + medicine + '\'' +
                ", medicineType='" + medicineType + '\'' +
                '}';
    }
}
