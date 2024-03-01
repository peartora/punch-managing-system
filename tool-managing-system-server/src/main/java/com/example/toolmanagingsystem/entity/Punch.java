package com.example.toolmanagingsystem.entity;

import com.example.toolmanagingsystem.dto.PunchRegister;
import com.example.toolmanagingsystem.dto.PunchStatus;
import com.example.toolmanagingsystem.repository.ProductRepository;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

@Entity(name = "punch-list")
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
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private PunchSupplier supplier;
    @Enumerated(EnumType.STRING)
    private PunchStatus status = PunchStatus.사용대기;
    private String location;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private String ptype;

    @Override
    public String toString() {
        return "Punch{" +
                "id=" + id +
                ", number='" + number + '\'' +
                ", registerDate=" + registerDate +
                ", type='" + type + '\'' +
                ", manufacturer='" + supplier + '\'' +
                ", status=" + status +
                ", location='" + location + '\'' +
                ", product=" + product +
                ", ptype='" + ptype + '\'' +
                '}';
    }

    public Punch(PunchRegister registerObject, PunchSupplier punchSupplier, Product product) {
        this.number = registerObject.getNumber();
        this.registerDate = registerObject.getDate();
        this.type = registerObject.getType();
        this.supplier = punchSupplier;
        this.location = registerObject.getLocation();
        this.product = product;
        this.ptype = registerObject.getProductType();
    }
    public Punch() {}
}
