package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.role.roleName = :name")
    List<User> findByRoleName(@Param("name") String name);
}
