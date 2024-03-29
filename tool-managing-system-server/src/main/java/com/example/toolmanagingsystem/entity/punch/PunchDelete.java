package com.example.toolmanagingsystem.entity.punch;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "delete_history")
@Data
public class PunchDelete
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    @Column(name = "punch_name")
    private String punch;

    private String medicine;
    @Column(name = "previous_status")
    @Enumerated(EnumType.STRING)
    private PunchStatus previousPunchStatus;
    private String reason;
    private LocalDate date;

    public PunchDelete(String punch, String medicine, PunchStatus previousPunchStatus, String reason, LocalDate date) {
        this.punch = punch;
        this.medicine = medicine;
        this.previousPunchStatus = previousPunchStatus;
        this.reason = reason;
        this.date = date;
    }

    public PunchDelete() {}

    @Override
    public String toString() {
        return "PunchDelete{" +
                "id=" + id +
                ", punchNumber=" + punch +
                ", medicineId=" + medicine +
                ", previousPunchStatus=" + previousPunchStatus +
                ", reason='" + reason + '\'' +
                ", date=" + date +
                '}';
    }
}
