package co.com.savia.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey = Keys.hmacShaKeyFor("4oClZf4F3KnF2s5p9L+FqgP+zA0KQkPyQ9l0u4Oel3U="
            .getBytes(StandardCharsets.UTF_8));

    public String generateToken(String username, String role) {
        // 1 día en milisegundos
        long expirationTime = 432000000;
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Añade el rol al token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
