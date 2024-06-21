package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminApiService {

    private final UserRepository userRepository;
    private final UserApiService userApiService;

    public ApiResponse approveId(Map<String, String> params)
    {
        String username = params.get("username");

        this.userApiService.validateUser(username);
        User user = this.userRepository.findByUsername(username);

        user.setApproved(true);

        this.userRepository.save(user);

        return ApiResponse.success(username);
    }

    public ApiResponse resetPassword(ResetPasswordRequestDto requestDto)
    {
        String username = requestDto.getUsername();
        this.userApiService.validateUser(username);
        User user = this.userRepository.findByUsername(username);

        String loginUsername = requestDto.getLoginUsername();
        this.userApiService.validateUser(loginUsername);
        User loginUser = this.userRepository.findByUsername(loginUsername);

        this.checkUserAuthority(loginUser, "resetPassword");

        String currentPassword = user.getPassword();
        String newPassword = requestDto.getNewPassword();

        this.userApiService.isNewPasswordSameWithCurrentPassword(currentPassword, newPassword);
        this.userApiService.isPasswordLongEnough(newPassword);

        user.setPassword(newPassword);
        user.setNotLocked(true);
        user.setTrialCount(0);
        user.setPasswordSetDate(LocalDate.now());

        this.userRepository.save(user);
        return ApiResponse.success(requestDto.getUsername());
    }

    public void checkUserAuthority(User user, String action)
    {
        String userRole = user.getUserRole().toString();

        switch (action)
        {
            case "restorePunch":
                if (!Objects.equals(userRole, "ADMIN") || !Objects.equals(userRole, "MANAGER"))
                {
                    throw new NotAuthorizeRequestException();
                }
                break;

            case "resetPassword":
                if (!Objects.equals(userRole, "ADMIN"))
                {
                    throw new NotAuthorizeRequestException();
                }
                break;

            default:
                throw new CorrectActionWasNotDefinedException();
        }
    }

}
