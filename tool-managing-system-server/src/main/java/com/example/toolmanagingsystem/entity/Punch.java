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
    @Column(name = "number")
    private String punchId;
    @Column(name = "register-date")
    private LocalDate registerDate;
    private String type;
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private PunchSupplier supplier;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PunchStatus punchStatus = PunchStatus.사용대기;
    @Column(name = "location")
    private String punchStorageLocation;
    private String specification;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product productType;
    private String ptype;

    @Override
    public String toString() {
        return "Punch{" +
                "id=" + id +
                ", number='" + punchId + '\'' +
                ", registerDate=" + registerDate +
                ", type='" + type + '\'' +
                ", manufacturer='" + supplier + '\'' +
                ", status=" + punchStatus +
                ", location='" + punchStorageLocation + '\'' +
                ", product=" + productType +
                ", ptype='" + ptype + '\'' +
                '}';
    }

    public Punch(PunchRegister registerObject, PunchSupplier punchSupplier, Product product) {
        this.punchId = registerObject.getNumber();
        this.registerDate = registerObject.getDate();
        this.type = registerObject.getType();
        this.supplier = punchSupplier;
        this.punchStorageLocation = registerObject.getLocation();
        this.productType = product;
        this.ptype = registerObject.getProductType();
        this.specification = registerObject.getSpecification();
    }
    public Punch() {}
}
