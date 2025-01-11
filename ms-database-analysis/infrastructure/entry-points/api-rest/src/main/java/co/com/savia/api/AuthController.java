package co.com.savia.api;

import co.com.savia.api.models.LoginRequest;
import co.com.savia.model.user.User;
import co.com.savia.api.security.JwtTokenProvider;
import co.com.savia.usecase.authusecase.AuthUseCase;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = authUseCase.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }
        if (!validatePassword(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(Map.of("token", token));
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
