package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity(name = "supplier")
@Data
public class Supplier
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    private String supplier;

    public Supplier(String supplier) {
        this.supplier = supplier;
    }

    public Supplier() {}
}
