package co.com.savia.api.security;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Log4j2
@Configuration
public class CorsConfig {

    /*
   @Bean
    public org.springframework.web.filter.CorsFilter<CorsFilter> corsFilter(@Value("${cors.allowed-origins}") String origins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
       if ("*".equals(origins)) {
           config.addAllowedOriginPattern("*"); // Acepta todos los dominios
       } else {
           config.setAllowedOrigins(List.of(origins.split(","))); // Lista específica de orígenes
       }
       config.setAllowedMethods(Arrays.asList("POST", "GET", "HEAD", "OPTIONS", "PUT", "DELETE"));
       config.setAllowedHeaders(List.of(CorsConfiguration.ALL));
       config.setExposedHeaders(List.of("Authorization", "Content-Type")); // Configura headers que se pueden exponer

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        final FilterRegistrationBean<CorsFilter> corsFilter = new FilterRegistrationBean<>(new CorsFilter(source));
        corsFilter.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return corsFilter;
    }

     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para simplificar la H2 Console
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/login").permitAll() // Permitir login sin token
                        .requestMatchers("/h2-console/**").permitAll() // Permitir acceso a H2 Console
                        //.requestMatchers("/api/**").hasRole("ADMIN") // Endpoints protegidos para admin
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated() // Proteger otras rutas
                )
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class) // Añade el filtro antes del de autenticación
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()) // Permitir iframes desde la misma fuente
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Permite todos los orígenes (ajusta según tus necesidades)
        configuration.addAllowedMethod("*"); // Permite todos los métodos HTTP
        configuration.addAllowedHeader("*"); // Permite todos los headers
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(false); // Configura según tus necesidades de autenticación

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica la configuración a todas las rutas
        return source;
    }
}
