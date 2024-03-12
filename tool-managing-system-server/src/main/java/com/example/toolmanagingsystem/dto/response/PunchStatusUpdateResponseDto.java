package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class PunchStatusUpdateResponseDto
{
    private int count;
    private String newStatus;
    public String message;

    public PunchStatusUpdateResponseDto(int count, String newStatus, String message)
    {
        this.count = count;
        this.newStatus = newStatus;
        this.message = message;
    }

    @Override
    public String toString()
    {
        return "PunchStatusUpdateResponseDto{" +
                "count=" + count +
                ", newStatus='" + newStatus + '\'' +
                '}';

    }
}
