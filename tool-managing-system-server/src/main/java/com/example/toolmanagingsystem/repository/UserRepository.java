package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    int countByUserId(String username);
    User findByUserId(String username);

}
