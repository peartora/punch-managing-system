package com.example.toolmanagingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
public class CleanHistory {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    @Column(name = "punch_number")
    private String punchNumber;

    @Column(name = "when_cleaned")
    private LocalDateTime date;

    @Column(name = "username")
    private String username;

    @Column(name = "batch")
    private String batch;

    @Column(name = "comment")
    private String comment;

    @Override
    public String toString() {
        return "CleanHistory{" +
                "id=" + id +
                ", punchNumber='" + punchNumber + '\'' +
                ", date=" + date +
                ", username='" + username + '\'' +
                ", batch='" + batch + '\'' +
                ", comment='" + comment + '\'' +
                '}';
    }

    public CleanHistory(String punchNumber, LocalDateTime date, String username, String batch, String comment) {
        this.punchNumber = punchNumber;
        this.date = date;
        this.username = username;
        this.batch = batch;
        this.comment = comment;
    }

    public CleanHistory() {}
}
