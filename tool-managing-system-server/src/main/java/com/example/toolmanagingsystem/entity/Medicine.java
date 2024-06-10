package com.example.toolmanagingsystem.entity;

import com.example.toolmanagingsystem.dto.request.MedicineRegisterRequestDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity(name = "medicine")
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

    public Medicine(String medicine, String filePath)
    {
        this.medicine = medicine;
        this.dateTime = LocalDateTime.now();
        this.specificationPath = filePath;
    }

    public Medicine() {}
}
