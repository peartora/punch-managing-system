package com.example.toolmanagingsystem.entity.punch;

import com.example.toolmanagingsystem.dto.request.PunchRegisterRequestDto;
import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.entity.Supplier;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "punch-list")
@Data
public class Punch
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "number")
    private String punchId;
    @Column(name = "date")
    private LocalDate date;
    @Column(name = "punch_position")
    private String punchPosition;
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PunchStatus punchStatus;
    @Column(name = "storage_location")
    private String storageLocation;
    private String specification;
    @ManyToOne
    @JoinColumn(name = "product_id")
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
                ", location='" + storageLocation + '\'' +
                ", product=" + medicineType +
                ", ptype='" + medicineType + '\'' +
                '}';
    }

    public Punch(PunchRegisterRequestDto requestDto, Supplier supplier, Medicine medicine) {
        this.punchId = requestDto.getPunchId();
        this.date = requestDto.getDate();
        this.punchPosition = requestDto.getPunchPosition();
        this.supplier = supplier;
        this.storageLocation = requestDto.getStorageLocation();
        this.punchStatus = PunchStatus.사용대기;
        this.medicine = medicine;
        this.medicineType = requestDto.getMedicineType();
    }
    public Punch() {}
}
