package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class PasswordChangeResponseDto
{
    private String username;
    private boolean isNewPasswordDifferentWithCurrentPassword;
    private boolean isNewPasswordSameWithNewPasswordConfirmation;
    private boolean isNewPasswordLonghEnough;
    private boolean isPasswordChanged;

    public PasswordChangeResponseDto (String username) {
        this.username = username;
    }

    public PasswordChangeResponseDto() {}

    @Override
    public String toString() {
        return "username: " + this.username +
            ", isPasswordChanged: " + this.isPasswordChanged +
            ", isNewPasswordDifferentWithCurrentPassword: " + this.isNewPasswordDifferentWithCurrentPassword +
            ", isNewPasswordSameWithNewPasswordConfirmation: " + this.isNewPasswordSameWithNewPasswordConfirmation +
            ", isNewPasswordLonghEnough: " + this.isNewPasswordLonghEnough;
    }
}
