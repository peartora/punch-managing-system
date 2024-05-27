package com.example.toolmanagingsystem.controller.user;


import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.*;

import com.example.toolmanagingsystem.dto.response.myPageResponseDto.MyPageResponseDto;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForAdmin;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForNotAdmin;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.UserIsNotExistException;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserService;
import com.example.toolmanagingsystem.error.user.DuplicatedUsernameException;
import com.example.toolmanagingsystem.error.user.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.error.user.PasswordNotSameException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/users")
@RequiredArgsConstructor
public class UserApiController
{
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping
    public ApiResponse registerUser (@RequestBody UserRegisterRequestDto requestDto)
    {
        System.out.println("registerUser");
        System.out.println(requestDto);

        boolean isPasswordSame = this.userService.isPasswordSame(requestDto);
        boolean isPasswordLongEnough = this.userService.isPasswordLongEnough(requestDto);

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

        return this.userService.login(requestDto);
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

        //responseDto를 하나로 묶어 처리 해야 함.

        if (Objects.equals(user.getUserRole().toString(), "ADMIN"))
        {
            System.out.println("Yes, Admin");

            PageResponseDtoForAdmin responseDto = new PageResponseDtoForAdmin(user.getUsername());
            responseDto.setAdmin(true);
            Iterable<User> userIterable = this.userRepository.findAll();

            responseDto.setUserList(userIterable);

            return ApiResponse.success(responseDto);
        }
        else
        {
            LocalDate passwordSetDate = user.getPasswordSetDate();
            PageResponseDtoForNotAdmin responseDto = new PageResponseDtoForNotAdmin(user.getUsername());
            responseDto.setAdmin(false);

            responseDto.setPasswordSetDate(user.getPasswordSetDate());
            responseDto.setUserRole(user.getUserRole());
            responseDto.setPasswordValidUntil(passwordSetDate.plusMonths(6));

            return ApiResponse.success(responseDto);
        }
    }
}
