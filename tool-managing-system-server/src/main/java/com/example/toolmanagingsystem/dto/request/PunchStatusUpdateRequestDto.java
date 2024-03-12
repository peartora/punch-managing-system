package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class PunchStatusUpdateRequestDto
{
    private String punchId;
    private String newStatus;

    @Override
    public String toString()
    {
        return "PunchStatusUpdateRequestDto{" +
                "punchId='" + punchId + '\'' +
                ", newStatus='" + newStatus + '\'' +
                '}';
    }

    public PunchStatusUpdateRequestDto(String punchId, String newStatus)
    {
        this.punchId = punchId;
        this.newStatus = newStatus;
    }
}
