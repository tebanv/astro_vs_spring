package co.com.savia.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    private final SecretKey secretKey;

    // Inyectamos la clave desde el application.yaml
    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        boolean skip = path.startsWith("/h2-console") || path.equals("/favicon.ico") || path.startsWith("/auth/");
        if (skip) {
            log.debug("Seguridad: Saltando filtro para la ruta pública: {}", path);
        }
        return skip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String token = resolveToken(request);

        if (token != null) {
            try {
                log.debug("Intentando validar token para la ruta: {}", path);
                Claims claims = validateToken(token);

                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                Date expiration = claims.getExpiration();

                // Validación manual de expiración
                if (expiration != null && expiration.before(new Date())) {
                    log.warn("Token expirado para el usuario: {} desde: {}", username, expiration);
                    throw new Exception("El token ha expirado");
                }

                String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                log.info("Autenticación exitosa: Usuario [{}] con Rol [{}] accediendo a [{}]", username, authority, path);

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(authority))
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                log.warn("Fallo de seguridad: Token expirado en la ruta [{}]. Detalle: {}", path, e.getMessage());
                handleException(response, "El token ha expirado");
                return;
            } catch (io.jsonwebtoken.security.SignatureException e) {
                log.error("¡ALERTA DE SEGURIDAD!: Firma de token inválida detectada en ruta [{}]. Posible intento de manipulación.", path);
                handleException(response, "Firma de token inválida");
                return;
            } catch (Exception e) {
                log.error("Error en validación de token para ruta [{}]: {}", path, e.getMessage());
                handleException(response, "Sesión inválida o expirada");
                return;
            }
        } else {
            // Log opcional: útil en desarrollo para saber por qué falló algo que debía estar protegido
            log.debug("Petición sin token detectada para ruta protegida: {}", path);
        }

        filterChain.doFilter(request, response);
    }

    // Método auxiliar para evitar repetir código de error y loguear la respuesta
    private void handleException(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
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