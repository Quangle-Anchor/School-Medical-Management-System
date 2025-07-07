package com.be_source.School_Medical_Management_System_.config;

import com.be_source.School_Medical_Management_System_.security.JwtAuthenticationFilter;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;    // Public FilterChain cho login, register
    @Bean
    @Order(1)
    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .securityMatcher("/api/auth/**", "/api/public/**","/api/password-recovery/**")
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    // Protected FilterChain cho các API cần bảo vệ
    @Bean
    @Order(2)
    public SecurityFilterChain protectedSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        // PHÂN QUYỀN RIÊNG CHO health-events:
                        // Cho phép tất cả role GET (xem)
                        .requestMatchers(HttpMethod.GET, "/api/health-events/**").hasAnyRole("ADMIN", "PRINCIPAL", "PARENT", "NURSE")
                        // Chỉ cho Principal và Nurse thêm, sửa, xoá
                        .requestMatchers(HttpMethod.POST, "/api/health-events/**").hasAnyRole("PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/health-events/**").hasAnyRole("PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/health-events/**").hasAnyRole("PRINCIPAL")

                        //PHÂN QUYỀN CHO EventSignup
                        .requestMatchers(HttpMethod.POST, "/api/event-signups/**").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/event-signups/my").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/event-signups/event/**").hasAnyRole("NURSE", "PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/event-signups/**").hasAnyRole("NURSE", "PRINCIPAL")

                        //PHÂN QUYỀN CHO Inventory va MedicalItem
                        .requestMatchers("/api/inventory/**").hasAnyRole("NURSE", "PRINCIPAL", "PARENT")
                        .requestMatchers("/api/medical-items/**").hasAnyRole("NURSE", "PRINCIPAL", "PARENT")

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/principal/**").hasRole("PRINCIPAL")
                        .requestMatchers("/api/nurse/**","/api/nurse/medications/**","/api/medications/nurse/**").hasRole("NURSE")
                        .requestMatchers("/api/parents/**","/api/medications/**").hasRole("PARENT")
                        .requestMatchers("/api/students/**").hasAnyRole("PARENT", "ADMIN", "PRINCIPAL", "NURSE")
                        .requestMatchers("/api/health-info/**").hasAnyRole("PARENT", "ADMIN", "PRINCIPAL", "NURSE")
                        .requestMatchers("/api/medications/prescription/**").hasAnyRole("PARENT", "ADMIN", "PRINCIPAL", "NURSE")
                        .requestMatchers("/api/medications/**").hasRole("PARENT")
                        .requestMatchers("/api/health-incidents/**").hasAnyRole("PRINCIPAL", "NURSE", "PARENT")
                        .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "PRINCIPAL", "NURSE", "PARENT")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Tạo JwtAuthenticationFilter từ constructor
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
