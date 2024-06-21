package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.NewPasswordSameWithCurrentPasswordException;
import com.example.toolmanagingsystem.error.user.NotAuthorizeRequestException;
import com.example.toolmanagingsystem.error.user.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.error.user.UserIsNotExistException;
import com.example.toolmanagingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

        if (!Objects.equals(loginUser.getUserRole().toString(), "ADMIN"))
        {
            System.out.println("not authorized");
            throw new NotAuthorizeRequestException();
        }

        String currentPassword = user.getPassword();
        String newPassword = requestDto.getNewPassword();

        System.out.println("currentPassword: " + currentPassword);
        System.out.println("newPassword: " + newPassword);


        if (currentPassword.equals(newPassword))
        {
            System.out.println("password is same for resetPassword");
            throw new NewPasswordSameWithCurrentPasswordException();
        }

        if (newPassword.length() < 6) {
            throw new PasswordLengthIsNotEnoughException();
        }

        user.setPassword(newPassword);
        user.setNotLocked(true);
        user.setTrialCount(0);
        user.setPasswordSetDate(LocalDate.now());

//        user = userApiService.initializeUser("resetPassword", user);
        this.userRepository.save(user);

        return ApiResponse.success(requestDto.getUsername());
    }

}
