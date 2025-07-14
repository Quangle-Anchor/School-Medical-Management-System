package com.be_source.School_Medical_Management_System_.config;

import com.be_source.School_Medical_Management_System_.security.JwtAuthenticationFilter;
import com.be_source.School_Medical_Management_System_.security.JwtUtil;
import com.be_source.School_Medical_Management_System_.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    // Public API
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/public/**",
            "/api/password-recovery/**",
            "/api/students/code/**"
    };

    // ADMIN role APIs
    private static final String[] ADMIN_ENDPOINTS = {
            "/api/admin/users/**"
    };

    // PRINCIPAL role APIs
    private static final String[] PRINCIPAL_ENDPOINTS = {
            "/api/principal/**",
            "/api/health-events/**",
    };

    // NURSE role APIs
    private static final String[] NURSE_ENDPOINTS = {
            "/api/nurse/**",
            "/api/nurse/medications/**",
            "/api/medications/nurse/**",
            "/api/event-signups/event/**",
            "/api/medical-items/**",
            "/api/inventory/**"
    };

    // PARENT role APIs
    private static final String[] PARENT_ENDPOINTS = {
            "/api/parents/**",
            "/api/medications/**",
            "/api/event-signups/**"
    };

    // SHARED/COMMON accessible APIs
    private static final String[] SHARED_ENDPOINTS_4ROLE = {
            "/api/students/**",
            "/api/health-info/**",
            "/api/medications/prescription/**",
            "/api/health-incidents/**",
            "/api/users/**"
    };
    private static final String[] SHARED_ENDPOINTS_3ROLE = {
            "/api/inventory/**",
            "/api/medical-items/**"
    };

    // Public filter chain
    @Bean
    @Order(1)
    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .securityMatcher(PUBLIC_ENDPOINTS)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    // Protected filter chain
    @Bean
    @Order(2)
    public SecurityFilterChain protectedSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth

                        // --- Health Event ---
                        .requestMatchers(HttpMethod.GET, "/api/health-events/**").hasAnyRole("ADMIN", "PRINCIPAL", "PARENT", "NURSE")
                        .requestMatchers(HttpMethod.POST, "/api/health-events/**").hasRole("PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/health-events/**").hasRole("PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/health-events/**").hasRole("PRINCIPAL")

                        // --- Event Signups ---
                        .requestMatchers(HttpMethod.POST, "/api/event-signups").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/event-signups/my").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/event-signups/event/**").hasAnyRole("PRINCIPAL", "NURSE", "PARENT")
                        .requestMatchers(HttpMethod.PUT, "/api/event-signups/event/*/approve-all").hasAnyRole("PRINCIPAL", "NURSE")
                        .requestMatchers(HttpMethod.PUT, "/api/event-signups/*/status").hasAnyRole("PRINCIPAL", "NURSE")

                        // --- Inventory & Medical Items ---
                        .requestMatchers(SHARED_ENDPOINTS_3ROLE).hasAnyRole("NURSE", "PRINCIPAL", "PARENT")

                        // --- Admin APIs ---
                        .requestMatchers(HttpMethod.GET, "/api/admin/users").hasAnyRole("ADMIN","PRINCIPAL")
                        .requestMatchers(ADMIN_ENDPOINTS).hasRole("ADMIN")

                        // --- Principal APIs ---
                        .requestMatchers(PRINCIPAL_ENDPOINTS).hasRole("PRINCIPAL")


                        // --- Nurse APIs ---
                        .requestMatchers(NURSE_ENDPOINTS).hasRole("NURSE")

                        // --- Parent APIs ---
                        .requestMatchers(PARENT_ENDPOINTS).hasRole("PARENT")

                        // --- Common APIs ---
                        .requestMatchers(SHARED_ENDPOINTS_4ROLE).hasAnyRole("ADMIN", "PRINCIPAL", "NURSE", "PARENT")
                        .requestMatchers(HttpMethod.POST, "/api/notifications/to-nurses").hasRole("PRINCIPAL")
                        .requestMatchers(HttpMethod.GET, "/api/notifications/my").hasRole("PARENT")
                        .requestMatchers(HttpMethod.PUT, "/api/notifications/{notificationId}/read-status","/api/notifications/mark-all-read").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/schedules/my-students").hasRole("PARENT")
                        .requestMatchers("/api/notifications/**").hasAnyRole("PRINCIPAL", "NURSE")
                        .requestMatchers("/api/schedules/**").hasRole("NURSE")



                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

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
