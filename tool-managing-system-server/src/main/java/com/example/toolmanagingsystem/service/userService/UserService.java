package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.LoginResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Service
public class UserService
{
    @Autowired
    UserRepository userRepository;
    LoginResponseDto responseDto;


    public boolean isPasswordSame(UserRegisterRequestDto requestDto) throws PasswordNotSameException
    {
        String password = requestDto.getPassword();
        String passwordConfirmation = requestDto.getPasswordConfirmation();

        if (!password.equals(passwordConfirmation))
        {
            throw new PasswordNotSameException();
        }

        return true;
    }

    public boolean isPasswordLongEnough(UserRegisterRequestDto requestDto) throws PasswordLengthIsNotEnoughException
    {
        String password = requestDto.getPassword();

        if (password.length() < 6)
        {
            throw new PasswordLengthIsNotEnoughException();
        }

        return true;
    }

    public ApiResponse login(LoginRequestDto requestDto) {
        System.out.println("login method called in UserService");

        User user;

        try
        {
            user = this.userRepository.findByUserId(requestDto.getUsername());
        }
        catch (Exception e)
        {
            throw new UserIsNotExistException();
        }

        System.out.println("user");
        System.out.println(user);

        this.isUserApproved(user);
        System.out.println("isUserApproved");

        this.isUserNotLocked(user);
        System.out.println("isUserNotLocked");

        this.isUserNotExpired(user);
        System.out.println("isUserNotExpired");

        this.isPasswordSame(user, requestDto.getPassword());
        System.out.println("isPasswordSame");

        System.out.println("before call final success of user");

        Map<String, String> usernameMap = new HashMap<>();
        usernameMap.put("username", user.getUserId());

        System.out.println("usernameMap");
        System.out.println(usernameMap.get("username"));

        return ApiResponse.success(usernameMap);
    }

    private void isUserApproved(User user)
    {
        System.out.println("isUserApproved called");

        if (!user.isApproved())
        {
            System.out.println("user is not Approved");
            throw new UserIsNotApprovedException();
        }
    }

    private void isUserNotLocked(User user) {
        System.out.println("isUserNotLocked called");

        if (!user.isNotLocked())
        {
            System.out.println("user is Locked");
            throw new UserIsLockedException();
        }
    }

    private void isUserNotExpired(User user) {
        System.out.println("isUserNotExpired called");

        if (!user.isNotExpired())
        {
            System.out.println("user is expired");
            throw new UserIsExpiredException();
        }
    }

    private void isPasswordSame(User user, String password) {
        System.out.println("isPasswordSame called");

        if (!Objects.equals(user.getPassword(), password))
        {
            System.out.println("password is not same!");
            this.increaseTrialcount(user);
            throw new PasswordNotSameException();
        }
        else
        {
            user.setTrialCount(0);
            this.userRepository.save(user);
        }
    }

    private void increaseTrialcount(User user) {
        System.out.println("increaseTrialcount called");

        int trialCount = user.getTrialCount();

        if (trialCount == 4) {
            user.setTrialCount(5);
            user.setNotLocked(false);
            this.userRepository.save(user);

            throw new UserIsLockedException();
        } else {
            user.setTrialCount(trialCount + 1);
            this.userRepository.save(user);
        }
    }



//    @Scheduled 이 함수는, 매일 자정 패스워드 유효 여부 확인
    public void isPasswordValid() {
        Iterable<User> userIterable = this.userRepository.findAll();
        List<User> userList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (User user: userIterable) {
            LocalDate registerDate = user.getCreatedDate();
            LocalDate sixMonthAfter = registerDate.plusMonths(6);

            if (sixMonthAfter.isBefore(today)) {
                user.setNotExpired(true);
                userList.add(user);
            }
        }
        this.userRepository.saveAll(userList);
    }
}
