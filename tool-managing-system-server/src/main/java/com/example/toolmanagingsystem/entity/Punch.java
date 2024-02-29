package com.example.toolmanagingsystem.entity;

import com.example.toolmanagingsystem.dto.PunchStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "punch-list")
@Table
@Data
public class Punch
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String number;
    @Column(name = "register-date")
    private LocalDate registerDate;
    private String type;
    private String manufacturer;
    private String specification;
    private PunchStatus status = PunchStatus.사용대기;
    private String location;
    private String product;
    private String ptype;
}
