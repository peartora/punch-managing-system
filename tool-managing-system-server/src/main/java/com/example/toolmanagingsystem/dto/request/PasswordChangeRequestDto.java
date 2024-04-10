package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class PasswordChangeRequestDto
{
    private String userId;
    private String currentPassword;
    private String newPassword;
    private String newPasswordConfirmation;


    @Override
    public String toString() {
        return "userId: " + this.userId +
                " currentPassword: " + this.currentPassword +
                " newPassword: " + this.newPassword +
                " newPasswordConfirmation" + this.newPasswordConfirmation;
    }
}
