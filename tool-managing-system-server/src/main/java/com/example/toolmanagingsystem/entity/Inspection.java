package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity(name = "inspection-history")
public class Inspection
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    @Column(name = "punch_number")
    private String punchNumber;

    @Column(name = "when_inspected")
    private LocalDateTime date;

    @Column(name = "file_path")
    private String filePath;

    @Override
    public String toString() {
        return "Inspection{" +
                "id=" + id +
                ", punchNumber='" + punchNumber + '\'' +
                ", date=" + date +
                ", filePath='" + filePath + '\'' +
                '}';
    }

    public Inspection(String punchNumber, LocalDateTime date, String filePath) {
        this.punchNumber = punchNumber;
        this.date = date;
        this.filePath = filePath;
    }

    public Inspection() {}
}
