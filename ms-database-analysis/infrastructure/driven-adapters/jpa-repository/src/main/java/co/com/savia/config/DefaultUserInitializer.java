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
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void initializeUsers() {
        // 1. Crear Administrador
        createIfNotFound("admin@saviaservicios.com", "admin123", "Administrador Principal", "ADMIN");

        // 2. Crear Analistas Genéricos
        createIfNotFound("analista1@saviaservicios.com", "analista123", "Analista Junior", "ANALISTA");
        createIfNotFound("analista2@saviaservicios.com", "analista123", "Analista Senior", "ANALISTA");
        createIfNotFound("analista3@saviaservicios.com", "analista123", "Analista Soporte", "ANALISTA");
    }

    private void createIfNotFound(String email, String password, String name, String role) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    // Ya existe, podrías loguear algo si quisieras
                },
                () -> {
                    UserEntity newUser = UserEntity.builder()
                            .email(email)
                            .password(passwordEncoder.encode(password))
                            .name(name)
                            .role(role)
                            .build();
                    userRepository.save(newUser);
                }
        );
    }

}
