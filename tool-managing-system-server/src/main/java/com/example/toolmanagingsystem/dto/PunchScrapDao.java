package com.example.toolmanagingsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Setter
@Getter
@Component
public class PunchScrapDao
{
    private String punchId;
    private String product;

    private String previousStatus;
    private PunchStatus newStatus;
    private String reason;

    public Map<String, Object> returnMapCollection()
    {
        Map<String, Object> deleteInformation = new HashMap<>();

        deleteInformation.put("punchId", this.punchId);
        deleteInformation.put("product", this.product);
        deleteInformation.put("previousStatus", this.previousStatus);
        deleteInformation.put("newStatus", this.newStatus.폐기.toString());
        deleteInformation.put("reason", this.reason);

        return deleteInformation;
    }
}
