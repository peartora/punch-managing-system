package com.example.toolmanagingsystem.entity.user;

import com.example.toolmanagingsystem.dto.request.UserRegisterRequestDto;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity(name = "user")
@Data
public class User
{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private String username;
    private String password;
    @Column(name = "user_role")
    @Enumerated(EnumType.STRING)
    private UserRole userRole;
    @Column(name = "is_not_locked")
    private boolean isNotLocked;
    @Column(name = "trial_count")
    private int trialCount;
    @Column(name = "is_approved")
    private boolean isApproved;
    @Column(name = "is_not_expired")
    private boolean isNotExpired;
    @Column(name = "created_date")
    private LocalDate createdDate;
    @Column(name = "password_set_date")
    private LocalDate passwordSetDate;


    public User(UserRegisterRequestDto userRegisterRequestDto) {
        this.username = userRegisterRequestDto.getUsername();
        this.password = userRegisterRequestDto.getPassword();
        this.userRole = UserRole.valueOf(userRegisterRequestDto.getRole());
        this.isNotLocked = false;
        this.trialCount = 0;
        this.isApproved = false;
        this.isNotExpired = false;
        this.createdDate = LocalDate.now();
        this.passwordSetDate = LocalDate.now();
    }

    public User() {}
}
