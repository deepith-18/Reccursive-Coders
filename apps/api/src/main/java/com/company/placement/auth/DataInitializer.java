package com.company.placement.auth;

import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmailIgnoreCase("admin@company.com")) {
            log.info("Seeding initial administrator account: admin@company.com");
            User admin = User.builder()
                    .email("admin@company.com")
                    .fullName("Platform Administrator")
                    .passwordHash(passwordEncoder.encode("AdminPassword123!"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .forcePasswordChange(false)
                    .phone("+91 9999999999")
                    .build();
            userRepository.save(admin);
            log.info("Initial administrator account seeded successfully.");
        }
    }
}
