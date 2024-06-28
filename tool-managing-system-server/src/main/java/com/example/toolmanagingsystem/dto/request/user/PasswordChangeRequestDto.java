package com.example.toolmanagingsystem.dto.request.user;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequestDto
{
    private String username;
    @Size(min = 6)
    private String newPassword;
    @Size(min = 6)
    private String newPasswordForConfirmation;

    @Override
    public String toString() {
        return "username: " + this.username +
                " newPassword: " + this.newPassword +
                " newPasswordForConfirmation: " + this.newPasswordForConfirmation;
    }
}
