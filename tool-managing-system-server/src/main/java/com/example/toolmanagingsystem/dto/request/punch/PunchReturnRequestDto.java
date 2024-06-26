package com.example.toolmanagingsystem.dto.request.punch;

import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Data
public class PunchReturnRequestDto
{
    @Nullable
    private final LocalDate startDate;
    @Nullable
    private final LocalDate endDate;
    @Nullable
    private final String punchPosition;
    @Nullable
    private final String supplier;
    @Nullable
    private final String status;
    @Nullable
    private final String medicine;
    @Nullable
    private final String medicineType;

    public boolean checkNull()
    {
        return (this.startDate == null) &&
                (this.endDate == null) &&
                (this.punchPosition == null) &&
                (this.supplier == null) &&
                (this.status == null) &&
                (this.medicine == null) &&
                (this.medicineType == null);
    }
}
