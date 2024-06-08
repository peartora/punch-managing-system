package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.user.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.user.LoginResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class UserApiService
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
        User user;

        try
        {
            user = this.userRepository.findByUsername(requestDto.getUsername());
        }
        catch (Exception e)
        {
            throw new UserIsNotExistException();
        }

        this.isUserApproved(user);
        this.isUserNotLocked(user);
        this.isUserNotExpired(user);
        this.isPasswordSame(user, requestDto.getPassword());

        Map<String, String> usernameMap = new HashMap<>();
        usernameMap.put("username", user.getUsername());

        return ApiResponse.success(usernameMap);
    }

    private void isUserApproved(User user)
    {
        if (!user.isApproved())
        {
            throw new UserIsNotApprovedException();
        }
    }

    private void isUserNotLocked(User user) {
        if (!user.isNotLocked())
        {
            throw new UserIsLockedException();
        }
    }

    private void isUserNotExpired(User user) {
        if (!user.isNotExpired())
        {
            throw new UserIsExpiredException();
        }
    }

    private void isPasswordSame(User user, String password) {
        if (!Objects.equals(user.getPassword(), password))
        {
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

    public User initializeUser(User user)
    {
        user.setTrialCount(0);
        user.setPasswordSetDate(LocalDate.now());
        user.setNotExpired(true);
        user.setNotLocked(true);

        return user;
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
