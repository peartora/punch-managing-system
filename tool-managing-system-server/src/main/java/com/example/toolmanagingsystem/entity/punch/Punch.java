package com.example.toolmanagingsystem.entity.punch;

import com.example.toolmanagingsystem.dto.request.punch.PunchRegisterRequestDto;
import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.entity.Supplier;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "punch")
@Data
public class Punch
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "punch_id")
    private String punchId;
    @Column(name = "register_date")
    private LocalDate date;
    @Column(name = "punch_position")
    private String punchPosition;
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PunchStatus punchStatus;
    private String specification;
    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;
    @Column(name = "medicine_type")
    private String medicineType;

    @Override
    public String toString() {
        return "Punch{" +
                "id=" + id +
                ", punchId='" + punchId + '\'' +
                ", date=" + date +
                ", punchPosition='" + punchPosition + '\'' +
                ", supplier='" + supplier + '\'' +
                ", St=" + punchStatus +
                ", product=" + medicineType +
                ", ptype='" + medicineType + '\'' +
                '}';
    }

    public Punch(PunchRegisterRequestDto requestDto, Supplier supplier, Medicine medicine) {
        this.punchId = requestDto.getPunchId();
        this.date = requestDto.getDate();
        this.punchPosition = requestDto.getPunchPosition();
        this.supplier = supplier;
        this.punchStatus = PunchStatus.사용대기;
        this.medicine = medicine;
        this.medicineType = requestDto.getMedicineType();
    }
    public Punch() {}
}
