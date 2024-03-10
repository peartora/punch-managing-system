package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    int countByUsername(String username);
    User findByUsername(String username);
}
