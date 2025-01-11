package co.com.savia.api.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.lang.Nullable;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Log4j2
@Component
public class TempFileCleaner implements HandlerInterceptor {

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Value("${temp.file.prefix:undertow}")
    private String tempFilePrefix;

    @Value("${temp.file.directory:#{systemProperties['java.io.tmpdir']}}")
    private String tempDirectory;

    @Value("${temp.file.max-age:1800}") // 30 minutos por defecto
    private long maxAgeSeconds;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (request.getContentType() != null && request.getContentType().contains("multipart/form-data")) {
            executorService.submit(this::cleanupTempFiles);
        }
    }

    //@Scheduled(fixedDelayString = "${temp.file.cleanup.interval:3600000}") // 1 hora por defecto
    public void scheduledCleanup() {
        log.info("Iniciando limpieza programada de archivos temporales");
        cleanupTempFiles();
    }

    private void cleanupTempFiles() {
        File tempDir = new File(tempDirectory);
        File[] tempFiles = tempDir.listFiles((dir, name) -> name.startsWith(tempFilePrefix));
        if (tempFiles != null) {
            for (File file : tempFiles) {
                try {
                    if (isFileOldEnough(file)) {
                        deleteWithRetry(file.toPath());
                    }
                } catch (Exception e) {
                    log.error("Error al procesar archivo temporal: {}", file.getAbsolutePath(), e);
                }
            }
        }
    }

    private boolean isFileOldEnough(File file) {
        Instant fileCreationTime;
        try {
            fileCreationTime = Files.getLastModifiedTime(file.toPath()).toInstant();
        } catch (IOException e) {
            log.warn("No se pudo obtener el tiempo de modificación para {}, error: {}",
                    file.getAbsolutePath(), e.getMessage());
            return false;
        }
        return Duration.between(fileCreationTime, Instant.now()).getSeconds() > maxAgeSeconds;
    }

    private void deleteWithRetry(Path path) {
        int maxRetries = 3;
        int retryDelayMs = 1000;

        for (int attempt = 0; attempt < maxRetries; attempt++) {
            try {
                Files.deleteIfExists(path);
                log.info("Archivo temporal eliminado: {}", path);
                return;
            } catch (IOException e) {
                if (attempt == maxRetries - 1) {
                    log.error("No se pudo eliminar el archivo temporal después de {} intentos: {}", maxRetries, path, e);
                } else {
                    log.warn("Intento {} fallido al eliminar archivo temporal: {}. Reintentando en {} ms", attempt + 1, path, retryDelayMs);
                    try {
                        TimeUnit.MILLISECONDS.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.error("Interrupción durante el reintento de eliminación", ie);
                        return;
                    }
                }
            }
        }
    }

}
