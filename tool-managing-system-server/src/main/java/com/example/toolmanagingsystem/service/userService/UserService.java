package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.request.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.request.PunchRegisterRequestDto;
import com.example.toolmanagingsystem.dto.request.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.LoginResponseDto;
import com.example.toolmanagingsystem.dto.response.PasswordChangeResponseDto;
import com.example.toolmanagingsystem.dto.response.PunchRegisterResponseDto;
import com.example.toolmanagingsystem.dto.response.UserRegisterResponseDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.DuplicatedIdError;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.exception.DuplicatedUsernameException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordNotSameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
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

    public void registerUser(UserRegisterRequestDto requestDto)
    {
        String password = requestDto.getPassword();
        String passwordConfirmation = requestDto.getPasswordConfirmation();

        this.isPasswordSame(password, passwordConfirmation);
        this.isPasswordLongEnough(password);

        User user = new User(requestDto);

        try
        {
            this.userRepository.save(user);
        }
        catch(DataAccessException e)
        {
            throw new DuplicatedUsernameException(e);
        }
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

    public boolean isNotDuplicate(String id)
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



    private boolean isPasswordSame(String password, String passwordConfirmation)
    {
        if (!password.equals(passwordConfirmation))
        {
            throw new PasswordNotSameException();
        }

        return true;
    }

    private boolean isPasswordLongEnough(String password)
    {
        if (password.length() < 6)
        {
            throw new PasswordLengthIsNotEnoughException();
        }

        return true;
    }

    private boolean isUsernameDuplicated(String username) throws SQLException
    {
        if (userRepository.findByUsername(username) == null)
        {
            return true;
        }
        else
        {
            throw new SQLException("Username is duplicated");
        }
    }
}
