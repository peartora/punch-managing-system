package com.example.toolmanagingsystem.service;

import com.example.toolmanagingsystem.dto.request.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.request.PunchRegisterRequestDto;
import com.example.toolmanagingsystem.dto.request.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.LoginResponseDto;
import com.example.toolmanagingsystem.dto.response.PasswordChangeResponseDto;
import com.example.toolmanagingsystem.dto.response.PunchRegisterResponseDto;
import com.example.toolmanagingsystem.dto.response.UserRegisterResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserService
{
    @Autowired
    UserRepository userRepository;
    LoginResponseDto responseDto;

    public UserRegisterResponseDto registerUser(UserRegisterRequestDto requestDto)
    {
        UserRegisterResponseDto responseDto = new UserRegisterResponseDto(requestDto.getUsername());

        System.out.println("initial responseDto");
        System.out.println(responseDto);

        boolean checkResult = this.isDuplicate(requestDto.getUsername());

        System.out.println("checkResult");
        System.out.println(checkResult);

        if (!checkResult) {
            responseDto.setDuplicate(true);
            responseDto.setRegistered(false);
            return responseDto;
        }

        System.out.println("after duplicate checkResult");
        System.out.println(responseDto);

        String password = requestDto.getPassword();
        String passwordConfirmation = requestDto.getPasswordConfirmation();

        if (Objects.equals(password, passwordConfirmation))
        {
            responseDto.setPasswordSameWithConfirmation(true);
        } else {
            responseDto.setPasswordSameWithConfirmation(false);
            responseDto.setRegistered(false);

            return responseDto;
        }

        System.out.println("after passwordSame");
        System.out.println(responseDto);

        if (password.length() >= 6)
        {
            responseDto.setPasswordLongEnough(true);
        } else {
            responseDto.setPasswordLongEnough(false);
            responseDto.setRegistered(false);

            return responseDto;
        }

        System.out.println("after password length check");
        System.out.println(responseDto);

        responseDto.setRegistered(true);

        System.out.println("final");
        System.out.println(responseDto);

        User user = new User(requestDto);
        this.userRepository.save(user);
        return responseDto;
    }

    public LoginResponseDto login(LoginRequestDto requestDto) {
        String name = requestDto.getUsername();
        System.out.println("name");
        System.out.println(name);

        User user = this.getUser(requestDto.getUsername());

        System.out.println("user");
        System.out.println(user);

        this.responseDto = new LoginResponseDto(user.getUsername());

        System.out.println("Initial responseDto");
        System.out.println(responseDto);

        this.isUserApproved(user);
        if (!this.responseDto.isApproved()) {
            return this.responseDto;
        }

        System.out.println("responseDto after check isApproved");
        System.out.println(responseDto);

        this.isUserNotLocked(user);
        if (!this.responseDto.isNotLocked()) {
            return this.responseDto;
        }

        System.out.println("responseDto after check isNotLocked");
        System.out.println(responseDto);

        if (!user.isNotExpired()) {
            this.responseDto.setNotExpired(false);
            this.responseDto.setLogin(false);
            return this.responseDto;
        } else {
            this.responseDto.setNotExpired(true);
            user.setNotExpired(true);
        }

        System.out.println("responseDto after check isNotExpired");
        System.out.println(responseDto);

        String password = user.getPassword();

        if (Objects.equals(requestDto.getPassword(), password)) {
            user.setTrialCount(0);
            this.responseDto.setPasswordCorrect(true);
            this.responseDto.setLogin(true);
        } else {
            this.responseDto.setPasswordCorrect(false);
            if (user.getTrialCount() == 4) {
                user.setTrialCount(5);
                user.setNotLocked(false);
                this.responseDto.setLoginTrialCount(5);
                this.responseDto.setNotLocked(false);
            } else {
                int beforeIncreaseTrialCount = user.getTrialCount();
                user.setTrialCount(beforeIncreaseTrialCount + 1);
                this.responseDto.setLoginTrialCount(beforeIncreaseTrialCount + 1);
            }
        }
        this.userRepository.save(user);

        System.out.println("final responseDto");
        System.out.println(responseDto);

        return this.responseDto;
    }

    public PasswordChangeResponseDto passwordChange(PasswordChangeRequestDto requestDto) {
        User user = this.getUser(requestDto.getUserId());

        PasswordChangeResponseDto responseDto = new PasswordChangeResponseDto(user.getUsername());

        if (Objects.equals(requestDto.getNewPassword(), requestDto.getNewPasswordConfirmation())) {
            if (!Objects.equals(requestDto.getCurrentPassword(), requestDto.getNewPassword())) {
                responseDto.setPasswordChanged(true);
                user.setPassword(requestDto.getNewPassword());
                this.userRepository.save(user);
            } else {
                responseDto.setPasswordChanged(false);
                responseDto.setNewPasswordSameWithCurrentPassword(true);
            }
        } else {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordSameWithNewPasswordConfirmation(true);
        }
        return responseDto;
    }


    public boolean isDuplicate(String id)
    {
       User user = this.getUser(id);

       if (user == null) {
           return true;
       } else {
           return false;
       }
    }

    private void isUserApproved(User user) {
        if (user.isApproved()) {
            this.responseDto.setApproved(true);
        } else {
            this.responseDto.setApproved(false);
            this.responseDto.setLogin(false);
        }
    }

    private void isUserNotLocked(User user) {
        if (user.isNotLocked()) {
            this.responseDto.setNotLocked(true);
        } else {
            this.responseDto.setNotLocked(false);
            this.responseDto.setLogin(false);
        }
    }

    public User getUser(String id)
    {
        return this.userRepository.findByUsername(id);
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
