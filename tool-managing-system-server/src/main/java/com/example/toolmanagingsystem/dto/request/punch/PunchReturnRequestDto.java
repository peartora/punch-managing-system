package com.example.toolmanagingsystem.dto.request.punch;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Data
public class PunchReturnRequestDto
{
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final String punchPosition;
    private final String supplier;
    private final String status;
    private final String medicine;
    private final String medicineType;
}
