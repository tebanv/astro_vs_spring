package co.com.savia.excel;

import co.com.savia.model.excel.gateways.ExcelRepository;
import com.github.benmanes.caffeine.cache.Cache;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@Service
public class CrudExcel implements ExcelRepository {

    private final Environment environment;

    private final Cache<String, List<Map<String, String>>> dictionaryCache;

    @Override
    public List<Map<String, String>> getDictionary(String dictionaryName) {
        return dictionaryCache.get(dictionaryName, key -> {
            try {
                String dictionaryFilePath = environment.getProperty("general.file-path-dictionaries") + File.separator
                        + dictionaryName + environment.getProperty("general.file-type-report-generated");
                return loadDictionary(dictionaryFilePath);
            } catch (Exception e) {
                throw new RuntimeException("Error loading dictionary: " + dictionaryName, e);
            }
        });
    }

    public List<Map<String, String>> loadDictionary(String dictionaryFilePath) throws Exception {
        List<Map<String, String>> dictionary = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(new File(dictionaryFilePath));
             Workbook workbook = new XSSFWorkbook(fis)) {
            Sheet sheet = workbook.getSheetAt(0); // Leer la primera hoja
            Row headerRow = sheet.getRow(0); // Asumimos que la primera fila contiene los encabezados
            if (headerRow == null) {
                throw new IllegalArgumentException("El diccionario no tiene encabezados.");
            }

            // Obtener encabezados
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue().trim());
            }

            // Leer las filas de datos (a partir de la segunda fila)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue; // Saltar filas vacías
                }

                Map<String, String> rowData = new HashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String cellValue = (cell != null) ? cell.toString().trim() : ""; // Manejar celdas vacías
                    rowData.put(headers.get(j), cellValue);
                }
                dictionary.add(rowData);
            }
        }
        return dictionary;
    }


    // Procesar el archivo Excel
    @Override
    public List<Map<String, String>> processExcelFile(InputStream dbFileInputStream) throws IOException {

        List<Map<String, String>> records = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(dbFileInputStream);
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

        log.info("Numero de Registros en Base de datos: {}", sheet.getLastRowNum());
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

    @Override
    public String generateErrorFileExcel(int sizeHeadersReport, List<String[]> errorRows, String filePath) {

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(environment.getProperty("general.sheet-name"));
            // Recorrer las filas de errores y escribirlas en el archivo Excel
            int rowNum = 0;
            for (String[] row : errorRows) {
                if (hasErrors(sizeHeadersReport, row)) {
                    Row excelRow = sheet.createRow(rowNum++); // Crear una fila en la hoja
                    for (int i = 0; i < row.length; i++) {
                        Cell cell = excelRow.createCell(i); // Crear una celda en la fila
                        cell.setCellValue(row[i]); // Establecer el valor de la celda
                    }
                }
            }

            // Ajustar el tamaño de las columnas al contenido
            for (int i = 0; i < errorRows.get(0).length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Escribir el archivo en la ruta especificada
            try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
                workbook.write(outputStream);
            }
        } catch (Exception e) {
            log.error("Error creando archivo Excel: {}", e.getMessage());
            filePath = null;
        }
        return filePath;
    }

    // Validar registros de errores vacios
    private boolean hasErrors(int sizeHeadersReport, String[] row) {
        int accumulate = 0;
        for (int i = sizeHeadersReport; i < row.length; i++) {
            String value = row[i];
            if (value != null && !value.trim().isEmpty()) {
                accumulate++;
            }
        }
        return accumulate != 0;
    }


}
