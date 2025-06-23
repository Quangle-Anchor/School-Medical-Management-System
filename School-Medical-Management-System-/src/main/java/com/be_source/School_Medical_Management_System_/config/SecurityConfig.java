package com.be_source.School_Medical_Management_System_.config;

import com.be_source.School_Medical_Management_System_.security.JwtAuthenticationFilter;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
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
                .securityMatcher("/api/auth/**", "/api/public/**")
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
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/principal/**","/api/health-incidents/**").hasRole("PRINCIPAL")
                        .requestMatchers("/api/nurse/**","/api/nurse/medications/**","/api/medications/nurse/**","/api/health-incidents/**").hasRole("NURSE")
                        .requestMatchers("/api/parents/**","/api/medications/**").hasRole("PARENT")
                        .requestMatchers("/api/students/**").hasAnyRole("PARENT", "ADMIN", "PRINCIPAL", "NURSE")
                        .requestMatchers("/api/health-info/**").hasAnyRole("PARENT", "ADMIN", "PRINCIPAL", "NURSE")
                        .requestMatchers("/api/medications/**").hasRole("PARENT")
                        .requestMatchers("/api/health-incidents/**").hasAnyRole("PRINCIPAL", "NURSE")
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
