package co.com.savia.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {


    private final SecretKey secretKey = Keys.hmacShaKeyFor("my-super-long-and-secure-secret-key-256-bits"
            .getBytes(StandardCharsets.UTF_8));

    public String generateToken(String username, String role) {
        // 1 día en milisegundos
        long expirationTime = 86400000;
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Añade el rol al token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
