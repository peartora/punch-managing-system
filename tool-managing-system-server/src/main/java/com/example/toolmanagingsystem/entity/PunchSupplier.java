package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity(name = "manufacturer")
@Data
public class PunchSupplier
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    private String supplier;

    public PunchSupplier(String supplier) {
        this.supplier = supplier;
    }

    public PunchSupplier() {}
}
