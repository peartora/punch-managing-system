package com.example.toolmanagingsystem.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Data
public class FetchPunchList
{
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String manufacturer;
    private String status;
    private String storageLocation;
    private String product;
    private String pType;
}
