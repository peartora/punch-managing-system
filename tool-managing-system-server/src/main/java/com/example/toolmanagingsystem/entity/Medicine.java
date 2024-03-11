package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity(name = "size-control")
@Data
public class Medicine
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    private String medicine;
    @Column(name = "date_time")
    private LocalDateTime dateTime;
    @Column(name = "specification_path")
    private String specificationPath;

    public Medicine(String medicine, LocalDateTime date, String specificationPath)
    {
        this.medicine = medicine;
        this.dateTime = date;
        this.specificationPath = specificationPath;
    }

    public Medicine() {}
}
