package co.com.savia.usecase.analyzedatabase;

import co.com.savia.model.report.request.DictionaryEntry;
import co.com.savia.model.report.request.ValidationRules;
import co.com.savia.model.report.response.ReportResponse;
import co.com.savia.usecase.analyzedatabase.util.Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.env.Environment;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

@Log4j2
@RequiredArgsConstructor
public class AnalyzeDatabaseUseCase {

    private final Environment environment;

    public ReportResponse analyzeDatabaseWithRules(List<Map<String, String>> records, ValidationRules rules,
                                                   String fileName) {
        try {
            log.info("Se pasa a validar cada registro...");
            List<String[]> errorRows = validateRecords(records, rules, fileName);
            log.info("Registros validados...");
            // Generar el archivo de errores
            String errorFilePath = generateErrorFileExcel(errorRows, fileName);

            if (errorFilePath != null && !errorFilePath.isEmpty()) {
                File errorFile = new File(errorFilePath);

                // Verificar si el archivo realmente existe en la ruta
                if (errorFile.exists()) {
                    log.info("Se generó un archivo de errores en la ruta: {}", errorFilePath);

                    return ReportResponse.builder()
                            .code(200)
                            .message("Se encontraron errores en los registros. El archivo de errores se encuentra en: " + errorFilePath)
                            .build();
                } else {
                    log.error("El archivo de errores no se pudo encontrar en la ruta: {}", errorFilePath);
                    return ReportResponse.builder()
                            .code(500)
                            .message("Se encontraron errores, pero no se pudo generar el archivo de errores.")
                            .build();
                }
            }
            return ReportResponse.builder()
                    .code(400)
                    .message("Se encontraron errores, revisa el archivo de errores.")
                    .build();

        } catch (Exception e) {
            log.info("error: {}", e.getMessage());
            return ReportResponse.builder()
                    .code(500)
                    .message("Error al procesar los archivos: " + e.getMessage())
                    .build();
        }

    }

    // Validar Bases de datos
    private List<String[]> validateRecords(List<Map<String, String>> records, ValidationRules rules, String fileName) {

        List<String[]> errorRows = new ArrayList<>();
        List<String> reportHeaders = rules.getReport().getHeaders();
        List<String> completeHeaders = new ArrayList<>(reportHeaders);

        Map<String, DictionaryEntry> dictionary = loadDictionary(environment.getProperty("routes.dictionary-common-names"));

        completeHeaders.addAll(environment.getProperty("headers.categoriesRules") != null ?
                        Arrays.asList(Objects.requireNonNull(environment.getProperty("headers.categoriesRules")).split(",")) :
                        null);


        String[] header = completeHeaders.toArray(new String[0]);
        errorRows.add(header);

        // Iterar sobre cada registro y realizar las validaciones
        for (Map<String, String> record : records) {

            String[] errorRow = new String[header.length];
            for (int i = 0; i < reportHeaders.size(); i++) {
                errorRow[i] = record.get(reportHeaders.get(i));
            }

            // Listas para recolectar errores por categoría
            List<String> nullErrors = new ArrayList<>();
            List<String> notNullErrors = new ArrayList<>();
            List<String> variableTypeErrors = new ArrayList<>();
            List<String> sizeErrors = new ArrayList<>();
            List<String> minMaxErrors = new ArrayList<>();
            List<String> duplicationErrors = new ArrayList<>();
            List<String> dictionaryValidationErrors = new ArrayList<>();
            List<String> comparisonBetweenColumnsErrors = new ArrayList<>();
            List<String> comparisonsWithDateErrors = new ArrayList<>();
            List<String> orderColumnsErrors = new ArrayList<>();
            List<String> rangeWithWordErrors = new ArrayList<>();
            List<String> datesRangeErrors = new ArrayList<>();
            List<String> specificValuesErrors = new ArrayList<>();
            List<String> conditionalNonNullErrors = new ArrayList<>();

            // Validar campos no nulos
            Util.validateFieldsNotNull(record, rules.getRules().getCategories().getNotNullRules(), notNullErrors);
            // Validar campos nulos
            Util.validateFieldsNull(record, rules.getRules().getCategories().getNullRules(), nullErrors);
            // Validar tipo de variables
            Util.validateVariableType(record, rules.getRules().getCategories().getVariableTypeRules(), variableTypeErrors);
            // Validar tamaños
            Util.validateSize(record, rules.getRules().getCategories().getSizeRules(), sizeErrors);
            // Validar mínimos y máximos
            Util.validateMinMax(record, rules.getRules().getCategories().getMinimumAndMaximumRules(), minMaxErrors);
            // Validar duplicaciones
            Util.validateDuplications(record, records, rules.getRules().getCategories().getDuplicationRules(), duplicationErrors);
            // Validar dictionary Validation
            //Util.validateDictionaryEntries(record, rules.getRules().getCategories().getDictionaryValidationRules(), dictionary, dictionaryValidationErrors);
            // Validar comparaciones entre campos
            Util.validateComparisonsBetweenColumns(record, rules.getRules().getCategories().getComparisonsWithOtherColumnRules(), comparisonBetweenColumnsErrors);
            // Validar comparaciones de fechas
            Util.validateDateComparisons(record, rules.getRules().getCategories().getComparisonsWithDateRules(), comparisonsWithDateErrors);
            // Validar orden de columnas
            Util.validateColumnOrder(record, rules.getRules().getCategories().getOrderColumnsRules(), orderColumnsErrors);
            // Validar rango con palabra
            Util.validateRangeWithWord(record, rules.getRules().getCategories().getRangeWithWordRules(), rangeWithWordErrors);
            // Validar fechas entre rangos
            Util.validateDatesInRange(record, rules.getRules().getCategories().getDateRangeRules(), datesRangeErrors);
            // Validar el valor de campos especificos
            Util.validateSpecificValues(record, rules.getRules().getCategories().getSpecificValuesRules(), specificValuesErrors);
            // Validar condicionales not nul
            Util.validateConditionalNonNull(record, rules.getRules().getCategories().getConditionalNonNullRules(), conditionalNonNullErrors);

            // Agregar los errores a las columnas correspondientes
            errorRow[3] = String.join("; ", notNullErrors); // No Nulos
            errorRow[4] = String.join("; ", nullErrors); // Nulos
            errorRow[5] = String.join("; ", variableTypeErrors);    // Tipo de variable
            errorRow[6] = String.join("; ", sizeErrors);  // Tamaño
            errorRow[7] = String.join("; ", minMaxErrors); // MinMax
            errorRow[8] = String.join("; ", duplicationErrors); // Duplicación
            errorRow[9] = String.join("; ", dictionaryValidationErrors); // Diccionario
            errorRow[10] = String.join("; ", comparisonBetweenColumnsErrors); // Comparación entre columnas
            errorRow[11] = String.join("; ", comparisonsWithDateErrors); // Comparación entre fechas

            errorRow[12] = String.join("; ", orderColumnsErrors); // Orden de columnas
            errorRow[13] = String.join("; ", rangeWithWordErrors); // Rango con palabra
            errorRow[14] = String.join("; ", datesRangeErrors); // fechas entre rangos
            errorRow[15] = String.join("; ", specificValuesErrors); // valor de campos especificos
            errorRow[16] = String.join("; ", conditionalNonNullErrors); // condicionales not null

            // Agregar los errores por cada categoría, separados por comas en una sola fila
            // Añadir la fila con errores a la lista de errores
            errorRows.add(errorRow);
        }

        return errorRows;
    }

    // Generar archivo en xlsx
    private String generateErrorFileExcel(List<String[]> errorRows, String fileName) {

        String filePath = Objects.requireNonNull(environment.getProperty("routes.file-path-report-generated"))
                .concat(fileName)
                .concat(Objects.requireNonNull(environment.getProperty("general.file-type-report-generated")));
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(environment.getProperty("general.sheet-name"));
            log.info("Llego hasta aca..");
            // Recorrer las filas de errores y escribirlas en el archivo Excel
            int rowNum = 0;
            for (String[] row : errorRows) {
                if (hasErrors(row)) {
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


    // Cargar diccionario
    private static Map<String, DictionaryEntry> loadDictionary(String filePath) {
        Map<String, DictionaryEntry> dictionary = new HashMap<>();

        try (Workbook workbook = new XSSFWorkbook(new FileInputStream(filePath))) {
            Sheet sheet = workbook.getSheetAt(1);  // Asumiendo que los datos están en la primera hoja

            // Iterar desde la segunda fila, asumiendo que la primera fila contiene los encabezados
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Leer cada celda en la fila
                String id = getCellValueAsString(row.getCell(0));
                String nombreCientifico = getCellValueAsString(row.getCell(1));
                String nombreComun = getCellValueAsString(row.getCell(2));
                String family = getCellValueAsString(row.getCell(3));
                String origen = getCellValueAsString(row.getCell(4));
                String reportsInColombia = getCellValueAsString(row.getCell(5));
                String habit = getCellValueAsString(row.getCell(6));
                String finish = getCellValueAsString(row.getCell(7));

                DictionaryEntry entry = DictionaryEntry.builder()
                        .id(id)
                        .nombreCientifico(nombreCientifico)
                        .nombreComun(nombreComun)
                        .family(family)
                        .origen(origen)
                        .reportsInColombia(reportsInColombia)
                        .habit(habit)
                        .finish(finish)
                        .build();

                dictionary.put(id, entry);
            }
        } catch (IOException e) {
            log.error("Error obteniendo archivo de diccionario: {}", e.getMessage());
            return null;
        }

        return dictionary;
    }

    // Validar registros de errores vacios
    private boolean hasErrors(String[] row) {
        int accumulate = 0;
        for (int i = 3; i < row.length; i++) {
            String value = row[i];
            if (value != null && !value.trim().isEmpty()) {
                accumulate++;
            }
        }
        return accumulate != 0;
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((int) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
}
