package com.example.toolmanagingsystem.controller.user;


import com.example.toolmanagingsystem.dto.ApiResponse;

import com.example.toolmanagingsystem.dto.request.user.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.user.MyPageRequestDto;
import com.example.toolmanagingsystem.dto.request.user.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.request.user.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.user.MyPageResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserApiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/users")
@RequiredArgsConstructor
public class UserApiController
{
    private final UserRepository userRepository;
    private final UserApiService userApiService;

    @PostMapping
    public ApiResponse registerUser (@RequestBody @Valid UserRegisterRequestDto requestDto, BindingResult bindingResult)
    {
        System.out.println("registerUser");
        this.userApiService.validateUserFormFields(bindingResult);

        return this.userApiService.registerUser(requestDto);
    }

    @PostMapping("/login")
    public ApiResponse loginUser(@RequestBody LoginRequestDto requestDto)
    {
        System.out.println("loginUser");
        System.out.println(requestDto);

        return this.userApiService.login(requestDto);
    }

    @PostMapping("/passwordChange")
    public ApiResponse passwordChange(@RequestBody PasswordChangeRequestDto requestDto, BindingResult bindingResult) {
        System.out.println("passwordChange");
        System.out.println(requestDto);
        this.userApiService.validateUserFormFields(bindingResult);

        return this.userApiService.passwordChange(requestDto);
    }

    // below...

    @PostMapping("/my_page")
    public ApiResponse createMyPage(@RequestBody MyPageRequestDto requestDto)
    {
        System.out.println("createMyPage");
        System.out.println(requestDto);

        User user = this.userRepository.findByUsername(requestDto.getUsername());

        System.out.println("user");
        System.out.println(user);

        MyPageResponseDto responseDto = new MyPageResponseDto(user.getUsername(), user.getUserRole(), user.getPasswordSetDate());

        return ApiResponse.success(responseDto);
    }

    @GetMapping
    public ApiResponse returnUserList()
    {
        System.out.println("returnUserList");

        List<User> userList = this.userRepository.findAll();
        return ApiResponse.success(userList);
    }
}
