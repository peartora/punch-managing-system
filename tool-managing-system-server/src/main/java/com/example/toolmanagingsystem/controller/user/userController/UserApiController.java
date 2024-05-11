package com.example.toolmanagingsystem.controller.user.userController;


import com.example.toolmanagingsystem.controller.user.userController.userResponse.UserApiResponse;
import com.example.toolmanagingsystem.dto.request.*;

import com.example.toolmanagingsystem.dto.response.myPageResponseDto.MyPageResponseDto;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForAdmin;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForNotAdmin;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserService;
import com.example.toolmanagingsystem.service.userService.exception.DuplicatedUsernameException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordNotSameException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/users")
@RequiredArgsConstructor
public class UserApiController
{
    private final UserRepository userRepository;
    private final UserService userService;

    @ExceptionHandler({DuplicatedUsernameException.class})
    public ResponseEntity<UserApiResponse> duplicateExceptionHandler(DuplicatedUsernameException duplicatedUsernameException)
    {
        System.out.println("DuplicateExceptionHandler called");

        UserApiResponse userApiResponse = UserApiResponse.fail(duplicatedUsernameException);
        return new ResponseEntity<>(userApiResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({PasswordNotSameException.class})
    public ResponseEntity<UserApiResponse> passwordNotSameExceptionHandler(PasswordNotSameException passwordNotSameException)
    {
        System.out.println("passwordNotSameExceptionHandler called");

        UserApiResponse userApiResponse = UserApiResponse.fail(passwordNotSameException);
        return new ResponseEntity<>(userApiResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({PasswordLengthIsNotEnoughException.class})
    public ResponseEntity<UserApiResponse> passwordLengthIsNotEnoughException(PasswordLengthIsNotEnoughException passwordLengthIsNotEnoughException)
    {
        System.out.println("passwordLengthIsNotEnoughException called");

        UserApiResponse userApiResponse = UserApiResponse.fail(passwordLengthIsNotEnoughException);
        return new ResponseEntity<>(userApiResponse, HttpStatus.CONFLICT);
    }

    @PostMapping
    public UserApiResponse registerUser (@RequestBody UserRegisterRequestDto requestDto)
    {
        // 아래, isPasswordSame, isPasswordLongEnough를 단위로 묶어 실행 할 수 있는, method가 필요 할지?(AOP 적용 관점에서, 혹은 코드 유지보수 관점에서)

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
                throw new DuplicatedUsernameException("duplicated username");
            }
        }

        return UserApiResponse.success(requestDto.getUsername());
    }

    @PostMapping("/authority")
    public String returnAuthority(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnAuthority");
        System.out.println(params);

        User user = this.userRepository.findByUserId(params.get("username").toString());
        return user.getUserRole().toString();
    }

    @PostMapping("/my_page")
    public MyPageResponseDto createMyPage(@RequestBody MyPageRequestDto requestDto)
    {
        System.out.println("createMyPage");
        System.out.println(requestDto);

        User user = this.userRepository.findByUserId(requestDto.getUsername());


        if (Objects.equals(user.getUserRole().toString(), "ADMIN"))
        {
            PageResponseDtoForAdmin responseDto = new PageResponseDtoForAdmin(user.getUserId());
            responseDto.setAdmin(true);
            Iterable<User> userIterable = this.userRepository.findAll();

            responseDto.setUserList(userIterable);

            return responseDto;
        }
        else
        {
            LocalDate passwordSetDate = user.getPasswordSetDate();
            PageResponseDtoForNotAdmin responseDto = new PageResponseDtoForNotAdmin(user.getUserId());
            responseDto.setAdmin(false);

            responseDto.setPasswordSetDate(user.getPasswordSetDate());
            responseDto.setUserRole(user.getUserRole());
            responseDto.setPasswordValidUntil(passwordSetDate.plusMonths(6));

            return responseDto;
        }
    }
}
