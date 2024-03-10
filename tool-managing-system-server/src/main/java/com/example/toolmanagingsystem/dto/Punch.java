package com.example.toolmanagingsystem.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
@Component
public class Punch
{
    private String punchId;
    private LocalDate date;
    private String type;
    private String manufacturer;
    private String specification;
    private PunchStatus status;
    private String location;
    private int batchSize;
    private int inspectionSize;
    private String product;
    private String productType;
}
