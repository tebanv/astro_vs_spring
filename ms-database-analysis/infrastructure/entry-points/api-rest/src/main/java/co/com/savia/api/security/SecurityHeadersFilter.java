package co.com.savia.api.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
@WebFilter("/**")
public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String path = req.getServletPath();

        // Si NO es la consola de H2, aplica las cabeceras estrictas
        if (!path.startsWith("/h2-console")) {
            res.setHeader("Content-Security-Policy", "default-src 'self'; frame-ancestors 'self'; form-action 'self'");
            res.setHeader("Strict-Transport-Security", "max-age=31536000;");
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        } else {
            // Para H2, podrías poner una política más relajada o no poner nada
            res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src 'self'");
        }

        res.setHeader("Server", "");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Pragma", "no-cache");

        chain.doFilter(request, response);
    }
}
