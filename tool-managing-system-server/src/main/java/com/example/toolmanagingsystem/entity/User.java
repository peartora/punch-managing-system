package com.example.toolmanagingsystem.entity;

import com.example.toolmanagingsystem.dto.UserDto;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "employee")
@Data
public class User
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    private String username;
    private String password;
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserRole userRole;
    @Column(name = "is_locked")
    private boolean isLocked;
    @Column(name = "trial_count")
    private int trialCount;
    @Column(name = "is_approved")
    private boolean isApproved;
    @Column(name = "created_date")
    private LocalDate createdDate;

    public User(UserDto userDto) {
        this.username = userDto.getId();
        this.password = userDto.getPassword();
        this.userRole = UserRole.valueOf(userDto.getRole());
        this.isLocked = false;
        this.trialCount = 0;
        this.isApproved = false;
        this.createdDate = LocalDate.now();
    }

    public User() {}
}
