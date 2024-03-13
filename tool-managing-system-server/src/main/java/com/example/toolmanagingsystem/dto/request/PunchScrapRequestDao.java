package com.example.toolmanagingsystem.dto.request;

import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;


@Setter
@Getter
@Component
public class PunchScrapRequestDao
{
    private String punchId;
    private String product;
    private String previousStatus;
    private String reason;

    @Override
    public String toString() {
        return "PunchScrapRequestDao{" +
                "punchId='" + punchId + '\'' +
                ", product='" + product + '\'' +
                ", previousStatus='" + previousStatus + '\'' +
                ", reason='" + reason + '\'' +
                '}';
    }

}
