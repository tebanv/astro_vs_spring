package co.com.savia.api;

import co.com.savia.model.report.ReportModel;
import co.com.savia.model.report.request.ValidationRules;
import co.com.savia.model.report.response.DownloadReport;
import co.com.savia.model.report.response.Error;
import co.com.savia.model.report.response.ReportResponse;
import co.com.savia.usecase.analyzedatabase.AnalyzeDatabaseUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class ApiRest {

    private final AnalyzeDatabaseUseCase useCase;

    //@PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/analyze-databases-savia")
    public Mono<ResponseEntity<?>> analyzeDatabases(@RequestParam("db-file") MultipartFile dbFile,
                                                @RequestParam("br-file") MultipartFile brFile) {

        long startTime = System.currentTimeMillis();
        Mono<ResponseEntity<?>> Bad_Request = validateBadRequest(dbFile, brFile);
        if (Bad_Request != null) return Bad_Request;

        String fileName = dbFile.getOriginalFilename();
        log.info("Iniciando flujo de análisis. DB: {} (Size: {} bytes) | Rules: {}",
                fileName, dbFile.getSize(), brFile.getOriginalFilename());
        try {
            List<Map<String, String>> records = useCase.processExcelFile(dbFile.getInputStream());
            log.info("Excel procesado. Registros extraídos: {}", records.size());

            ValidationRules rules = processJsonFile(brFile);
            log.info("Archivo de reglas de negocio leido: {}", rules);


            String sanitizedFileName = fileName != null ?
                    fileName.replaceAll(" ", "").replaceAll("\\.(xlsx|csv)$", "") : "unknown";

            return useCase.analyzeDatabaseWithRules(records, rules, sanitizedFileName)
                    .map(reportResponse -> {
                        long duration = System.currentTimeMillis() - startTime;
                        if (reportResponse.getCode() == HttpStatus.OK.value()) {
                            log.info("Análisis exitoso para {}. Tiempo total: {}ms", sanitizedFileName, duration);
                            return ResponseEntity.status(reportResponse.getCode()).body(reportResponse.getData());
                        } else {
                            log.warn("El análisis para {} terminó con errores de validación. Código: {}", sanitizedFileName, reportResponse.getCode());
                            return ResponseEntity.status(reportResponse.getCode()).body(reportResponse.getError());
                        }
                    });


        } catch (Exception e) {
            log.error("Error crítico durante el análisis del archivo {}: {}", fileName, e.getMessage(), e); // Agrega 'e' al final para el stacktrace
            return Mono.just(ResponseEntity.internalServerError()
                    .body(ReportResponse.builder()
                            .error(Error.builder()
                                    .detail("Error interno: " + e.getMessage())
                                    .message("Internal Server Error")
                                    .build())
                            .build()));
        }
    }

    @GetMapping("/report-status/{reportId}")
    public Mono<ResponseEntity<ReportModel>> getReportStatus(@PathVariable("reportId") String reportId) {
        log.info("Consultando estado del reporte ID: {}", reportId);
        return useCase.getReportStatus(reportId)
                .map(response -> {
                    log.info("Estado obtenido para reporte {}: {}", reportId, response != null ? "ENCONTRADO" : "NO ENCONTRADO");
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    log.error("Error al consultar el reporte {}: {}", reportId, e.getMessage());
                    return Mono.just(ResponseEntity.status(404).build());
                });
    }

    @GetMapping("/download-excel/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("filename") String filename) {
        log.info("Solicitud de descarga de archivo: {}", filename);
        try {
            DownloadReport downloadReport = useCase.getResource(filename);
            log.info("Archivo {} enviado exitosamente al cliente.", filename);
            return ResponseEntity.status(downloadReport.getCode())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(downloadReport.getData());
        } catch (Exception e) {
            log.error("Error al descargar el archivo {}: {}", filename, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    private static Mono<ResponseEntity<?>> validateBadRequest(MultipartFile dbFile, MultipartFile brFile) {
        if (dbFile.isEmpty() || brFile.isEmpty()) {
            log.error("Uno o ambos archivos están vacíos.");
            return Mono.just(ResponseEntity.badRequest()
                    .body(ReportResponse.builder()
                            .error(Error.builder()
                                    .detail("Ambos archivos son requeridos y no deben estar vacíos.")
                                    .message("Bad Request")
                                    .build())
                            .build()));
        }
        return null;
    }



    // Procesar el archivo JSON
    private ValidationRules processJsonFile(MultipartFile brFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper.readValue(brFile.getInputStream(), ValidationRules.class);
    }


}
