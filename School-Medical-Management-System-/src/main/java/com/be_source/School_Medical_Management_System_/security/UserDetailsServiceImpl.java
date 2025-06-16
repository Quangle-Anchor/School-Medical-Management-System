package com.be_source.School_Medical_Management_System_.security;


import com.be_source.School_Medical_Management_System_.model.User;
import com.be_source.School_Medical_Management_System_.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Ở đây mình login bằng email
        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Trả về đối tượng UserDetails để Security xử lý
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),  // Đây chính là mật khẩu đã hash trong DB
                Collections.emptyList()  // Tạm thời không gán role
        );
    }
}