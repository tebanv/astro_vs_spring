package co.com.savia.api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

@Component
public class JwtTokenProvider {

    private final Environment environment;
    private final SecretKey secretKey;
    // Inyectamos el Environment en el constructor
    public JwtTokenProvider(Environment environment) {
        this.environment = environment;
        // Obtenemos el secreto
        String secret = environment.getProperty("jwt.secret");

        // Validamos que no sea nulo (opcional pero recomendado)
        Objects.requireNonNull(secret, "La propiedad 'jwt.secret' no puede ser nula");

        // Inicializamos la llave. Al estar en el constructor, ya podemos usar 'final'
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }



    public String generateToken(String username, String role) {
        long expirationTime = Long.parseLong(Objects.requireNonNull(environment.getProperty("jwt.expiration")));
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
