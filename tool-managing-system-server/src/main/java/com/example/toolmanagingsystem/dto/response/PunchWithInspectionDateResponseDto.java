package com.example.toolmanagingsystem.dto.response;

import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.entity.Supplier;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PunchWithInspectionDateResponseDto {
    private String punchId;
    private LocalDate date;
    private String punchPosition;
    private Supplier supplier;
    private PunchStatus punchStatus;
    private String specification;
    private Medicine medicine;
    private String medicineType;
    private LocalDateTime latestInspectionDate;
    private String inspectionFilePath;

    public PunchWithInspectionDateResponseDto(
            String punchId,
            LocalDate date,
            String punchPosition,
            Supplier supplier,
            PunchStatus punchStatus,
            String specification,
            Medicine medicine,
            String medicineType,
            LocalDateTime latestInspectionDate,
            String inspectionFilePath
            ) {

        this.punchId = punchId;
        this.date = date;
        this.punchPosition = punchPosition;
        this.supplier = supplier;
        this.punchStatus = punchStatus;
        this.specification = specification;
        this.medicine = medicine;
        this.medicineType = medicineType;
        this.latestInspectionDate = latestInspectionDate;
        this.inspectionFilePath = inspectionFilePath;
    }
}
