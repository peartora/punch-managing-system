package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class PasswordChangeResponseDto
{
    private String userId;
    private boolean isNewPasswordSameWithCurrentPassword;
    private boolean isNewPasswordSameWithNewPasswordConfirmation;
    private boolean isPasswordChanged;

    public PasswordChangeResponseDto (String userId) {
        this.userId = userId;
    }

    public PasswordChangeResponseDto() {}

    @Override
    public String toString() {
        return "userId: " + this.userId +
            ", isPasswordChanged" + this.isPasswordChanged +
            ", isNewPasswordSameWithCurrentPassword" + this.isNewPasswordSameWithCurrentPassword +
            ", isNewPasswordSameWithNewPasswordConfirmation" + this.isNewPasswordSameWithNewPasswordConfirmation;
    }
}
