package com.example.toolmanagingsystem.controller.user;

import com.example.toolmanagingsystem.dto.request.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.dto.response.ResetPasswordResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tool-managing-system/admin")
@RequiredArgsConstructor
public class AdminApiController
{
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/idList")
    public List<Map<String, Object>> returnIdList()
    {
        System.out.println("returnIdList");

        List<Map<String, Object>> idList = new ArrayList<>();
        Iterable<User> userIterableList = this.userRepository.findAll();

        for (User user: userIterableList)
        {
            Map<String, Object> idMap = new HashMap<>();
            idMap.put("username", user.getUserId());
            idMap.put("is_not_locked", user.isNotLocked());
            idMap.put("is_approved", user.isApproved());
            idMap.put("role", user.getUserRole());
            idList.add(idMap);
        }

        return idList;
    }

    @PostMapping("/approveId")
    public String approveId(@RequestBody Map<String, Object> params)
    {
        System.out.println("approveId");
        System.out.println(params);

        User user = this.userRepository.findByUserId(params.get("username").toString());
        user.setApproved(true);
        user.setNotExpired(true);
        user.setNotLocked(true);
        try
        {
            this.userRepository.save(user);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    @PostMapping("/resetPassword")
    public ResetPasswordResponseDto resetPassword(@RequestBody ResetPasswordRequestDto requestDto)
    {
        System.out.println("resetPassword");
        System.out.println(requestDto);

        User user = this.userRepository.findByUserId(requestDto.getUsername());
        String currentPassword = user.getPassword();

        ResetPasswordResponseDto responseDto = new ResetPasswordResponseDto(requestDto.getUsername());

        if (currentPassword.equals(requestDto.getPassword()))
        {
            responseDto.setPasswordSameWithCurrentPassword(true);
            return responseDto;
        }
        else
        {
            responseDto.setPasswordSameWithCurrentPassword(false);
        }

        if (requestDto.getPassword().length() < 6)
        {
            responseDto.setPasswordLongEnough(false);
            return responseDto;
        }
        else
        {
            responseDto.setPasswordLongEnough(true);
        }

        responseDto.setPasswordReset(true);
        user.setPassword(requestDto.getPassword());
        user.setPasswordSetDate(LocalDate.now());
        user.setTrialCount(0);
        this.userRepository.save(user);

        return responseDto;
    }

    @PostMapping("/delete_user")
    public String deleteUser(@RequestBody Map<String, Object> params)
    {
        System.out.println("deleteUser");
        System.out.println(params);

        User user = this.userRepository.findByUserId(params.get("username").toString());
        try
        {
            this.userRepository.delete(user);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

}
