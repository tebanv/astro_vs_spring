package co.com.savia.api;

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

    //@PreAuthorize("hasRole('permission')")
    @PostMapping("/analyze-databases-savia")
    public Mono<ResponseEntity<?>> analyzeDatabases(@RequestParam("db-file") MultipartFile dbFile,
                                                @RequestParam("br-file") MultipartFile brFile) {

        Mono<ResponseEntity<?>> Bad_Request = validateBadRequest(dbFile, brFile);
        if (Bad_Request != null) return Bad_Request;

        log.info("Se inicia el analisis de la base de datos: {} con el archivo de config: {}",
                dbFile.getOriginalFilename(), brFile.getOriginalFilename());
        try {
            List<Map<String, String>> records = useCase.processExcelFile(dbFile.getInputStream());
            log.info("Archivo de Excel leido...");

            ValidationRules rules = processJsonFile(brFile);
            log.info("Archivo de reglas de negocio leido: {}", rules);


            String fileName = dbFile.getOriginalFilename() != null ?
                    dbFile.getOriginalFilename().replaceAll(" ", "")
                            .replaceAll("\\.(xlsx|csv)$", "") : dbFile.getOriginalFilename();

            return useCase.analyzeDatabaseWithRules(records, rules, fileName)
                    .map(reportResponse -> {
                        if (reportResponse.getCode() == HttpStatus.OK.value()) {
                            return ResponseEntity
                                    .status(reportResponse.getCode())
                                    .body(reportResponse.getData());
                        } else {
                            return ResponseEntity
                                    .status(reportResponse.getCode())
                                    .body(reportResponse.getError());
                        }

                    });


        } catch (Exception e) {
            log.error("error creando reporte: {}", e.getMessage());
            return Mono.just(ResponseEntity.internalServerError()
                    .body(ReportResponse.builder()
                            .error(Error.builder()
                                    .detail("Error creando reporte: ".concat(e.getMessage()))
                                    .message("Not Found")
                                    .build())
                            .build()));
        }
    }

    //@PreAuthorize("hasRole('permission')")
    @GetMapping("/report-status/{reportId}")
    public Mono<ResponseEntity<?>> getReportStatus(@PathVariable("reportId") String reportId) {
        log.info("Se consulta reporte por id: {}", reportId);
        try {
            return useCase.getReportStatus(reportId)
                    .map(response -> {
                        if (response != null) {
                            return ResponseEntity.ok(response);
                        } else {
                            return ResponseEntity.status(404)
                                    .body(ReportResponse.builder()
                                            .error(Error.builder()
                                                    .detail("Error buscando reporte con id: ".concat(reportId))
                                                    .message("Not Found")
                                                    .build())
                                            .build());
                        }
                    });
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(404)
                    .body(ReportResponse.builder()
                            .code(404)
                            .error(Error.builder()
                                    .detail("No se encontro reporte con id: ".concat(reportId))
                                    .message("Not Found")
                                    .build())
                            .build()));
        }

    }

    @GetMapping("/download-excel/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("filename") String filename) {
        try {
            log.info("Se recibe peticion para descaragr archivo: {}", filename);
            DownloadReport downloadReport = useCase.getResource(filename);
            return ResponseEntity.status(downloadReport.getCode())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(downloadReport.getData());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource(("Error serving file: " + e.getMessage()).getBytes()));
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
