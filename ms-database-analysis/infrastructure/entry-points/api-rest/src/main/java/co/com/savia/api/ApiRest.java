package co.com.savia.api;

import co.com.savia.model.report.request.ValidationRules;
import co.com.savia.model.report.response.ReportResponse;
import co.com.savia.usecase.analyzedatabase.AnalyzeDatabaseUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
@Log4j2
public class ApiRest {

    private final AnalyzeDatabaseUseCase useCase;

    //@PreAuthorize("hasRole('permission')")
    @GetMapping(path = "/path")
    public String commandName() {
//      return useCase.doAction();
        return "Hello World";
    }

    //@PreAuthorize("hasRole('permission')")
    @PostMapping("/analyze-databases-savia")
    public ResponseEntity<String> uploadExcel2(@RequestParam("db-file") MultipartFile dbFile,
                                               @RequestParam("br-file") MultipartFile brFile) {

        if (dbFile.isEmpty() || brFile.isEmpty()) {
            log.error("Uno o ambos archivos están vacíos.");
            return ResponseEntity.badRequest().body("Ambos archivos son requeridos y no deben estar vacíos.");
        }
        log.info("Se inicia el analisis de la base de datos: {} con el archivo de config: {}",
                dbFile.getOriginalFilename(), brFile.getOriginalFilename());
        try {

            List<Map<String, String>> records = processExcelFile(dbFile);
            log.info("Archivo de Excel leido");

            ValidationRules rules = processJsonFile(brFile);
            log.info("Archivo de reglas de negocio leido: {}", rules);

            String fileName = dbFile.getOriginalFilename() != null ?
                    dbFile.getOriginalFilename().replaceAll(" ", "")
                    .replaceAll("\\.(xlsx|csv)$", "") : dbFile.getOriginalFilename();

            ReportResponse reportResponse =
                    useCase.analyzeDatabaseWithRules(records, rules, fileName);

            return ResponseEntity.status(reportResponse.getCode()).body(reportResponse.getMessage());
        } catch (Exception e) {
            log.error("error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar los archivos: " + e.getMessage());
        }
    }

    // Procesar el archivo Excel
    private List<Map<String, String>> processExcelFile(MultipartFile file) throws IOException {

        List<Map<String, String>> records = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
        Sheet sheet = workbook.getSheetAt(0);

        // Obtener la fila de encabezados y detectar la primera columna con datos
        Row headerRow = sheet.getRow(0);
        int firstDataColumnIndex = -1;
        List<String> headers = new ArrayList<>();

        // Detectar la primera columna de datos
        for (Cell cell : headerRow) {
            if (cell.getCellType() != CellType.BLANK) {
                if (firstDataColumnIndex == -1) {
                    firstDataColumnIndex = cell.getColumnIndex();
                }
                headers.add(cell.getStringCellValue());
            }
        }

        if (firstDataColumnIndex == -1) {
            throw new RuntimeException("El archivo Excel no tiene encabezados en la primera fila.");
        }

        // Iterar sobre cada fila de datos
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;  // Saltar filas vacías
            Map<String, String> record = new HashMap<>();

            for (int j = 0; j < headers.size(); j++) {
                int cellIndex = firstDataColumnIndex + j;
                Cell cell = row.getCell(cellIndex);
                String header = headers.get(j);

                try {
                    // Verificar si la celda es nula o está vacía
                    if (cell == null || cell.getCellType() == CellType.BLANK) {
                        record.put(header, "");
                    } else {
                        // Evaluar la celda en caso de que contenga una fórmula
                        cell = evaluator.evaluateInCell(cell);

                        // Procesar el valor de la celda según su tipo
                        switch (cell.getCellType()) {
                            case STRING:
                                record.put(header, cell.getStringCellValue());
                                break;
                            case NUMERIC:
                                if (DateUtil.isCellDateFormatted(cell)) {
                                    record.put(header, cell.getDateCellValue().toString());
                                } else {
                                    double numericValue = cell.getNumericCellValue();
                                    if (numericValue == Math.floor(numericValue)) {
                                        record.put(header, String.valueOf((int) numericValue));
                                    } else {
                                        record.put(header, String.valueOf(numericValue));
                                    }
                                }
                                break;
                            case BOOLEAN:
                                record.put(header, String.valueOf(cell.getBooleanCellValue()));
                                break;
                            case FORMULA:
                                // Obtener el valor calculado de la fórmula
                                record.put(header, evaluator.evaluate(cell).formatAsString());
                                break;
                            default:
                                record.put(header, cell.toString());
                        }
                    }
                } catch (Exception e) {
                    // Registrar el error con información detallada
                    log.error("Error procesando celda en la columna '{}' y fila '{}': {}", header, i, e.getMessage());
                    throw new RuntimeException("Error procesando el archivo Excel: " + e.getMessage());
                }
            }

            // Agregar el registro procesado a la lista
            records.add(record);
        }

        workbook.close();
        return records;
    }

    // Procesar el archivo JSON
    private ValidationRules processJsonFile(MultipartFile brFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        // Leer el contenido del archivo JSON como una cadena
        String jsonContent = new String(brFile.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        // Imprimir el contenido del JSON en la consola
        System.out.println("Contenido del JSON recibido:");
        System.out.println(jsonContent);
        return objectMapper.readValue(brFile.getInputStream(), ValidationRules.class);
    }


}
