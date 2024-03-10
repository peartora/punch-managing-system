package com.example.toolmanagingsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class PunchRegister
{
    private String number;
    private LocalDate date;
    private String type;
    private String specification;
    private String manufacturer;
    private PunchStatus status;
    private String location;
    private String product;
    private String productType;
}
