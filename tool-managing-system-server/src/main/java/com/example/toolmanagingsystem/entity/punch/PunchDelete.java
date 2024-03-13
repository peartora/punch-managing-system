package com.example.toolmanagingsystem.entity.punch;

import com.example.toolmanagingsystem.entity.Medicine;
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

    @OneToOne
    @JoinColumn(name = "punch_id")
    private Punch punchNumber;

    @OneToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicineId;

    @Column(name = "previous_status")
    @Enumerated(EnumType.STRING)
    private PunchStatus previousPunchStatus;
    private String reason;
    private LocalDate date;

    public PunchDelete(Punch punchNumber, Medicine medicineId, PunchStatus previousPunchStatus, String reason, LocalDate date) {
        this.punchNumber = punchNumber;
        this.medicineId = medicineId;
        this.previousPunchStatus = previousPunchStatus;
        this.reason = reason;
        this.date = date;
    }

    public PunchDelete() {}

    @Override
    public String toString() {
        return "PunchDelete{" +
                "id=" + id +
                ", punchNumber=" + punchNumber +
                ", medicineId=" + medicineId +
                ", previousPunchStatus=" + previousPunchStatus +
                ", reason='" + reason + '\'' +
                ", date=" + date +
                '}';
    }
}
