package co.com.savia.api.config;

import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Log4j2
@Configuration
@EnableScheduling
public class TempFileConfig {


    @Value("${temp.file.directory}")
    private String tempDirectory;

    @PostConstruct
    public void init() {
        try {
            Path tempDir = Path.of(tempDirectory);
            if (!Files.exists(tempDir)) {
                Files.createDirectories(tempDir);
                log.info("Directorio temporal creado: {}", tempDir);
            }
        } catch (IOException e) {
            log.error("No se pudo crear el directorio temporal", e);
        }
    }
}