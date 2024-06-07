package com.example.toolmanagingsystem.controller.user;


import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.response.PasswordChangeResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Objects;

@RestController
@RequestMapping("/api/tool-managing-system/auth")
@RequiredArgsConstructor
public class AuthApiController
{
    private final UserRepository userRepository;
    private final UserApiService userApiService;

    @PostMapping("/login")
    public ApiResponse login (@RequestBody LoginRequestDto requestDto)
    {
        return this.userApiService.login(requestDto);
    }

    @PostMapping("/password_change")
    public PasswordChangeResponseDto changePassword (@RequestBody PasswordChangeRequestDto requestDto)
    {
        System.out.println("changePassword");
        System.out.println(requestDto);

        String username = requestDto.getUsername();
        User user = this.userRepository.findByUsername(username);

        PasswordChangeResponseDto responseDto = new PasswordChangeResponseDto(username);

        if (Objects.equals(user.getPassword(), requestDto.getNewPassword()))
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordDifferentWithCurrentPassword(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordDifferentWithCurrentPassword(true);
        }

        if (!Objects.equals(requestDto.getNewPassword(), requestDto.getNewPasswordForConfirmation()))
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordSameWithNewPasswordConfirmation(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordSameWithNewPasswordConfirmation(true);
        }


        if (requestDto.getNewPassword().length() < 6)
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordLonghEnough(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordLonghEnough(true);
        }

        responseDto.setPasswordChanged(true);
        user.setPassword(requestDto.getNewPassword());
        user.setPasswordSetDate(LocalDate.now());
        this.userRepository.save(user);
        return responseDto;
    }

}
