package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import javax.annotation.processing.Generated;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "size-control")
@Data
public class Product
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    private String product;
    @Column(name = "date")
    private LocalDateTime dateTime;
    @Column(name = "specification-path")
    private String specificationPath;

    public Product(String product, LocalDateTime date, String specificationPath)
    {
        this.product = product;
        this.dateTime = date;
        this.specificationPath = specificationPath;
    }

    public Product() {}
}
