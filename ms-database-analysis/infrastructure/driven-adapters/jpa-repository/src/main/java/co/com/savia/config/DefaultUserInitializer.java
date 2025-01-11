package co.com.savia.config;

import co.com.savia.model.UserEntity;
import co.com.savia.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DefaultUserInitializer {
    private final UserRepository userRepository;

    @PostConstruct
    public void initializeDefaultAdmin() {
        String defaultEmail = "admin@savia.com";
        String defaultPassword = "admin123";
        String defaultName = "Administrador";
        String defaultRole = "ADMIN";

        userRepository.findByEmail(defaultEmail).ifPresentOrElse(user -> {
            // Usuario ya existe, no hacer nada
        }, () -> {
            // Crear usuario por defecto
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            UserEntity admin = UserEntity.builder()
                    .email(defaultEmail)
                    .password(passwordEncoder.encode(defaultPassword))
                    .name(defaultName)
                    .role(defaultRole)
                    .build();
            userRepository.save(admin);
        });
    }

}
