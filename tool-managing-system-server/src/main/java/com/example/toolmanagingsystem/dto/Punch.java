package com.example.toolmanagingsystem.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
@Component
public class Punch
{
    private String number;
    private LocalDate date;
    private String type;
    private String manufacturer;
//    private String specification;
    private PunchStatus status;
    private String location;
    private int batchSize;
    private int inspectionSize;
    private String product;
    private String productType;

    public Map<String, Object> returnMapCollection()
    {
        Map<String, Object> registerInformation = new HashMap<>();

        registerInformation.put("number", this.number);
        registerInformation.put("date", this.date);
        registerInformation.put("type", this.type);
        registerInformation.put("manufacturer", this.manufacturer);
//        registerInformation.put("specification", this.specification);
        registerInformation.put("status", this.status.사용대기.toString());
        registerInformation.put("location", this.location);
        registerInformation.put("batchSize", this.batchSize);
        registerInformation.put("inspectionSize", this.inspectionSize);
        registerInformation.put("product", this.product);
        registerInformation.put("productType", this.productType);

        return registerInformation;
    }
}
