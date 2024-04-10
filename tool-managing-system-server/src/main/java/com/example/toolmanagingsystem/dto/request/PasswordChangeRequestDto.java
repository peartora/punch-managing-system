package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class PasswordChangeRequestDto
{
    private String username;
    private String newPassword;
    private String newPasswordForConfirmation;


    @Override
    public String toString() {
        return "username: " + this.username +
                " newPassword: " + this.newPassword +
                " newPasswordForConfirmation: " + this.newPasswordForConfirmation;
    }
}
