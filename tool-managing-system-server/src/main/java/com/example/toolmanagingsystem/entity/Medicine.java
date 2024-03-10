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
    private String product;
    @Column(name = "date")
    private LocalDateTime dateTime;
    @Column(name = "specification-path")
    private String specificationPath;

    public Medicine(String product, LocalDateTime date, String specificationPath)
    {
        this.product = product;
        this.dateTime = date;
        this.specificationPath = specificationPath;
    }

    public Medicine() {}
}
