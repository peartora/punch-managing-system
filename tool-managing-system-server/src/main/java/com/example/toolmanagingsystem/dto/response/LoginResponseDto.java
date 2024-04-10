package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class LoginResponseDto
{
    private String username;
    private boolean isLogin;
    private boolean isApproved;
    private boolean isNotLocked;
    private boolean isNotExpired;
    private boolean isPasswordCorrect;
    private int loginTrialCount;

    public LoginResponseDto (String username) {
        this.username = username;
        this.loginTrialCount = 0;
    }

    public LoginResponseDto() {}

    @Override
    public String toString() {
        return "username= " + this.username +
                ", isLogin= " + this.isLogin +
                ", isApproved= " + this.isApproved +
                ", isNotLocked= " + this.isNotLocked +
                ", isNotExpired= " + this.isNotExpired +
                ", isPasswordCorrect= " + this.isPasswordCorrect +
                ", loginTrialCount= " + this.loginTrialCount;

    }
}
