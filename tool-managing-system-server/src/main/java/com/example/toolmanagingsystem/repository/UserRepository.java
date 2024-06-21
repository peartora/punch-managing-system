package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    User findByUsername(String username);
    List<User> findAll();
}
