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
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/users")
@RequiredArgsConstructor
public class UserApiController
{
    private final UserRepository userRepository;
    private final UserApiService userApiService;

    @GetMapping
    public ApiResponse returnUserList()
    {
        System.out.println("returnUserList");

        Iterable<User> userIterable = this.userRepository.findAll();

        List<User> userList = new ArrayList<>();
        for (User user : userIterable) {
            userList.add(user);
        }

        Map<String, List<User>> userListMap = new HashMap<>();
        userListMap.put("userList", userList);

        return ApiResponse.success(userListMap);
    }

    @PostMapping
    public ApiResponse registerUser (@RequestBody UserRegisterRequestDto requestDto)
    {
        System.out.println("registerUser");
        System.out.println(requestDto);

        boolean isPasswordSame = this.userApiService.isPasswordSame(requestDto);
        boolean isPasswordLongEnough = this.userApiService.isPasswordLongEnough(requestDto);

        if (isPasswordSame && isPasswordLongEnough)
        {
            System.out.println("isPasswordSame && isPasswordLongEnough");

            User user = new User(requestDto);

            try
            {
                this.userRepository.save(user);
            }
            catch (Exception e)
            {
                throw new DuplicatedUsernameException();
            }
        }

        Map<String, String> usernameMap = new HashMap<>();
        usernameMap.put("username", requestDto.getUsername());

        return ApiResponse.success(usernameMap);
    }

    @PostMapping("/login")
    public ApiResponse loginUser(@RequestBody LoginRequestDto requestDto)
    {
        System.out.println("loginUser");
        System.out.println(requestDto);

        return this.userApiService.login(requestDto);
    }


    @PostMapping("/authority")
    public String returnAuthority(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnAuthority");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        return user.getUserRole().toString();
    }

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

    @PostMapping("/passwordChange")
    public ApiResponse passwordChange(@RequestBody PasswordChangeRequestDto requestDto) {
        System.out.println("passwordChange");
        System.out.println(requestDto);

        String username = requestDto.getUsername();
        String newPassword = requestDto.getNewPassword();
        String newPasswordForConfirmation = requestDto.getNewPasswordForConfirmation();

        if (!Objects.equals(newPassword, newPasswordForConfirmation))
        {
            throw new PasswordNotSameException();
        }

        if (newPassword.length() < 6)
        {
            throw new PasswordLengthIsNotEnoughException();
        }

        User user = this.userRepository.findByUsername(username);

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        if (Objects.equals(user.getPassword(), newPassword))
        {
            throw new NewPasswordSameWithCurrentPasswordException();
        }

        user.setPassword(newPassword);
        user = this.userApiService.initializeUser(user);

        this.userRepository.save(user);

        return ApiResponse.success(username);
    }
}
