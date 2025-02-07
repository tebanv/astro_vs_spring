package co.com.savia.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

@Log4j2
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecretKey secretKey = Keys.hmacShaKeyFor("4oClZf4F3KnF2s5p9L+FqgP+zA0KQkPyQ9l0u4Oel3U="
            .getBytes(StandardCharsets.UTF_8));

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null) {
            try {
                Claims claims = validateToken(token);
                String role = claims.get("role", String.class);

                // Opcional: Verifica que el token no esté expirado (JJWT ya lanza una excepción si es el caso)
                Date expiration = claims.getExpiration();
                if(expiration != null && expiration.before(new Date())) {
                    throw new Exception("El token ha expirado");
                }
                // Si el valor del rol en el token es "ADMIN", agregamos el prefijo "ROLE_"
                String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                // Configurar la autenticación con los datos del token
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), // Usuario (principal)
                        null, // Credenciales (generalmente null en JWT)
                        Collections.singletonList(new SimpleGrantedAuthority(authority)) // Autoridades (roles)
                );
                // Establecer el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Sesion invalida o expirada o sin los privilegios necesarios");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}