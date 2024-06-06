package com.example.toolmanagingsystem.controller.user;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.dto.response.ResetPasswordResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.NewPasswordSameWithCurrentPasswordException;
import com.example.toolmanagingsystem.error.user.NotAuthorizeRequestException;
import com.example.toolmanagingsystem.error.user.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.error.user.UserIsNotExistException;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

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
            idMap.put("username", user.getUsername());
            idMap.put("is_not_locked", user.isNotLocked());
            idMap.put("is_approved", user.isApproved());
            idMap.put("role", user.getUserRole());
            idList.add(idMap);
        }

        return idList;
    }

    @PostMapping("/approveId")
    public ApiResponse approveId(@RequestBody Map<String, Object> params)
    {
        System.out.println("approveId");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        user.setApproved(true);
        user.setNotExpired(true);
        user.setNotLocked(true);

        this.userRepository.save(user);

        Map<String, String> usernameMap = new HashMap<>();
        usernameMap.put("username", (String) params.get("username"));

        return ApiResponse.success(usernameMap);
    }

    @PostMapping("/resetPassword")
    public ApiResponse resetPassword(@RequestBody ResetPasswordRequestDto requestDto)
    {
        System.out.println("resetPassword");
        System.out.println(requestDto);

        User user = this.userRepository.findByUsername(requestDto.getUsername());

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        if (!Objects.equals(user.getUserRole().toString(), "ADMIN"))
        {
            throw new NotAuthorizeRequestException();
        }

        String currentPassword = user.getPassword();
        String newPassword = requestDto.getNewPassword();

        if (currentPassword.equals(newPassword))
        {
            throw new NewPasswordSameWithCurrentPasswordException();
        }

        if (newPassword.length() < 6) {
            throw new PasswordLengthIsNotEnoughException();
        }

        user.setPassword(newPassword);
        user = userService.initializeUser(user);
        this.userRepository.save(user);

        Map<String, String> usernameMap = new HashMap<>();
        usernameMap.put("username", user.getUsername());

        return ApiResponse.success(usernameMap);
    }

    @PostMapping("/delete_user")
    public ApiResponse deleteUser(@RequestBody Map<String, Object> params)
    {
        System.out.println("deleteUser");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        this.userRepository.delete(user);
        return ApiResponse.success(params.get("username"));
    }
}
