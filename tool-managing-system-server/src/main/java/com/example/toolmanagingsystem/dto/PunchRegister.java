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
    private String manufacturer;
    private PunchStatus status;
    private String location;
    private String product;
    private String productType;

    public Map<String, Object> returnMapCollection()
    {
        Map<String, Object> registerInformation = new HashMap<>();

        registerInformation.put("number", this.number);
        registerInformation.put("date", this.date);
        registerInformation.put("type", this.type);
        registerInformation.put("manufacturer", this.manufacturer);
        registerInformation.put("status", this.status.사용대기.toString());
        registerInformation.put("location", this.location);
        registerInformation.put("product", this.product);
        registerInformation.put("productType", this.productType);

        return registerInformation;
    }
}
